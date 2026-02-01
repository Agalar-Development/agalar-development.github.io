import fs from 'fs-extra';
import { glob } from 'glob';
import { exec } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, '../1.21.11_unobfuscated');
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');
const CONCURRENCY = 4;

console.log(`Scanning: ${SOURCE_DIR}`);
console.log(`Output: ${OUTPUT_DIR}`);

async function main() {
    await fs.ensureDir(OUTPUT_DIR);

    const classFiles = await glob('**/*.class', { cwd: SOURCE_DIR, absolute: true });
    console.log(`Found ${classFiles.length} class files.`);

    const searchIndex = [];
    const usageMap = new Map();
    const classDetails = new Map();

    let processedCount = 0;

    const processFile = async (filePath) => {
        try {
            const relPath = path.relative(SOURCE_DIR, filePath);
            const { stdout } = await execPromise(`javap -p -c -s "${filePath}"`, 10000);

            const details = parseJavapOutput(stdout, relPath);
            if (!details) return;

            searchIndex.push({
                n: details.name,
                p: details.package,
                f: details.fqn,
                t: details.type
            });

            details.references.forEach(ref => {
                if (!usageMap.has(ref)) usageMap.set(ref, new Set());
                usageMap.get(ref).add(details.fqn);
            });

            classDetails.set(details.fqn, details);

        } catch (e) {
            console.error(`Error processing ${path.basename(filePath)}: ${e.message || e}`);
        }
    };

    const queue = [...classFiles];
    const workers = [];

    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push((async () => {
            while (queue.length > 0) {
                const file = queue.pop();
                if (file) {
                    await processFile(file);
                    processedCount++;
                    if (processedCount % 50 === 0) {
                        process.stdout.write(`\rProcessed ${processedCount}/${classFiles.length}`);
                    }
                }
            }
        })());
    }

    await Promise.all(workers);
    console.log('\nFinished parsing. Writing data...');

    await fs.outputJson(path.join(OUTPUT_DIR, 'search_index.json'), searchIndex);

    let wroteCount = 0;
    for (const [fqn, details] of classDetails.entries()) {
        const usages = usageMap.has(fqn) ? Array.from(usageMap.get(fqn)) : [];
        details.usages = usages;

        const outPath = path.join(OUTPUT_DIR, 'classes', ...details.package.split('.'), `${details.name}.json`);
        await fs.outputJson(outPath, details);
        wroteCount++;
        if (wroteCount % 1000 === 0) {
            process.stdout.write(`\rWriting ${wroteCount}/${classDetails.size}`);
        }
    }

    const packageTree = {};
    for (const item of searchIndex) {
        const parts = item.p.split('.');
        let current = packageTree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = { _classes: [], _sub: {} };
            }
            if (i === parts.length - 1) {
                current[part]._classes.push({ n: item.n, t: item.t, f: item.f });
            }
            current = current[part]._sub;
        }
    }

    await fs.outputJson(path.join(OUTPUT_DIR, 'package_tree.json'), packageTree);

    console.log('\nDone!');
}

function execPromise(cmd, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs }, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}

function parseJavapOutput(output, relPath) {
    const lines = output.split(/\r?\n/);

    let fqn = '';
    let simpleName = '';
    let packageName = '';
    let type = 'class';
    let references = new Set();

    const classDeclRegex = /^(?:public |protected |private |abstract |static |final |sealed |non-sealed )*(class|interface|enum|record) ([\w.$]+)/;

    for (const line of lines) {
        const match = line.trim().match(classDeclRegex);
        if (match) {
            type = match[1];
            fqn = match[2];
            break;
        }
    }

    if (!fqn) return null;

    if (fqn.includes('<')) {
        fqn = fqn.substring(0, fqn.indexOf('<'));
    }

    const lastDot = fqn.lastIndexOf('.');
    if (lastDot !== -1) {
        packageName = fqn.substring(0, lastDot);
        simpleName = fqn.substring(lastDot + 1);
    } else {
        simpleName = fqn;
    }

    const refRegex = /\/\/ (?:class|Method|Field|InterfaceMethod) ((?:[a-zA-Z0-9_$]+(?:\/|\.)+)+[a-zA-Z0-9_$]+)/;

    const members = [];

    for (const line of lines) {
        const refMatch = line.match(refRegex);
        if (refMatch) {
            let refRaw = refMatch[1];
            let refDot = refRaw.replace(/\//g, '.');

            if (refDot.includes(':')) refDot = refDot.substring(0, refDot.indexOf(':'));

            if (refDot !== fqn && !refDot.startsWith('[')) {
                if (!refDot.startsWith('java.') && !refDot.startsWith('javax.') && !refDot.startsWith('sun.')) {
                    references.add(refDot);
                }
            }
        }

        const trimmed = line.trim();
        if ((trimmed.includes('(') || trimmed.includes(';'))
            && !trimmed.startsWith('//')
            && !trimmed.startsWith('Code:')
            && !trimmed.includes('return')
            && !trimmed.match(/^\d+:/)
            && !trimmed.startsWith('descriptor:')
            && !trimmed.startsWith('LineNumberTable:')
            && !trimmed.startsWith('LocalVariableTable:')
            && !trimmed.startsWith('StackMapTable:')
        ) {
            members.push(trimmed);
        }
    }

    return {
        name: simpleName,
        package: packageName,
        fqn: fqn,
        type: type,
        members: members,
        references: Array.from(references)
    };
}

main().catch(console.error);
