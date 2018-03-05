/**
 * This simple script will try to download the latest versions of your
 * dependencies, as in your package.json.
 *
 * Usage: node upgrade-deps.js [--no-git] [--no-commit] [--push [REMOTE]]
 *
 * --no-git:
 *   git will not be called: we'll upgrade packages locally and exit.
 *
 * --no-commit:
 *   git will be called only to have a diff
 *
 * If neither of the two flags above are passed, and if there are differences
 * in package.json and/or package-lock.json, a new branch will be created, and
 * the changes will be committed.
 *
 * --push [REMOTE]:
 *   The changes will be pushed. You can optionally pass a remote name,
 *   defaults to 'origin'.
 *
 *
 * Built upon:
 * npm 5.6.0
 * git 2.7.4
 *
 * NOTE: package.json and package-lock.json should be already tracked in git!
 */

const util = require('util')
const path = require('path')
const readFile = util.promisify(require('fs').readFile)
const execFile = util.promisify(require('child_process').execFile)

/**
 * @returns {Object}
 */
async function getRootAndDependencies() {
  let rootDir = process.cwd()
  let deps = false
  while (deps === false) {
    let contents
    try {
      contents = await readFile(path.join(rootDir, 'package.json'), 'utf8')
    } catch (err) {
      if (err.code === 'ENOENT') {
        // file not found, try with parent directory
        // not sure if it results in an infinite loop when no package.json is found
        rootDir = path.dirname(rootDir)
        continue
      }
      throw err
    }
    deps = Object.keys(JSON.parse(contents).dependencies)
  }
  return { rootDir, deps }
}

/**
 * Install the latest version of packages
 * @param {string} rootDir where to run npm
 * @param {string[]} packages names
 */
async function installLatest(rootDir, ...packages) {
  for (const package of packages) {
    console.log(`  ${package}...`)
    try {
      await execFile('npm', ['install', `${package}@latest`], { cwd: rootDir })
    } catch (err) {
      throw new Error(err.stderr)
    }
  }
}

/**
 * Check if files passed as arguments were modified comparing to current index
 * @param {string} rootDir
 * @param {string[]} files relative to rootDir
 * @returns {Boolean} true if at least one file differs
 */
async function checkDiff(rootDir, ...files) {
  try {
    await execFile('git', ['diff-index', '--quiet', 'HEAD', '--'].concat(files), { cwd: rootDir })
    return false // the command above returned 0, that means no differences => we exit
  } catch (err) {
    if (err.stderr) { // a real error
      throw new Error(err.stderr || err.stdout)
    }
  }
  return true
}

/**
 * Create a new branch, add the provided files and commit.
 *
 * @param {string} rootDir
 * @param {string} branch
 * @param {string} message
 * @param {string[]} files
 */
async function commit(rootDir, branch, message, ...files) {
  const commands = [
    ['checkout', '-B', branch],
    ['add', '--'].concat(files),
    ['commit', '-m', message],
  ]
  try {
    console.log('Running git')
    for (const cmd of commands) {
      console.log(`  ${cmd[0]}...`)
      await execFile('git', cmd, { cwd: rootDir })
    }
  } catch (err) {
    throw new Error(err.stderr || err.stdout)
  }
}

async function run(args) {
  const files = ['package.json', 'package-lock.json']
  const branch = 'deps-upgrade'

  console.log('Looking for package.json file...')
  const { rootDir, deps } = await getRootAndDependencies()

  console.log('Installing latest versions of dependencies...')
  await installLatest(rootDir, ...deps)

  if (!args.includes('--no-git')) {
    console.log('Checking diff against git HEAD...')
    const differs = await checkDiff(rootDir, ...files)
    console.log(differs ? 'Great scott, we have updates!' : 'Already up-to-date.')

    if (differs && !args.includes('--no-commit')) {
      await commit(rootDir, branch, 'Upgrade dependencies', ...files)

      const pushIndex = args.indexOf('--push')
      if (pushIndex != -1) {
        const remote = args[pushIndex + 1] || 'origin'
        console.log(`Pushing to ${remote} ${branch}...`)
        await execFile('git', ['push', '--force', remote, branch], { cwd: rootDir })
      }
    }
  }
  console.log('Done!')
}

run(process.argv)
