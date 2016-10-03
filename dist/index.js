"use strict";
const plugins = require("./smartjspm.plugins");
const q = require("q");
class SmartJspm {
    constructor(optionsArg) {
        this.dependencyArray = [];
        this.jspmPath = plugins.path.join(plugins.path.parse(require.resolve('jspm')).dir, 'jspm.js');
        this.targetDir = optionsArg.targetDir;
        this.npmDevDir = optionsArg.npmDevDir;
    }
    /**
     * installs jspm dependencies into a directory
     */
    installJspmTarget(targetDirArg = this.targetDir) {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(targetDirArg);
        this.writeJspmPackageJson();
        plugins.jspm.setPackagePath(targetDirArg);
        plugins.shelljs.exec(`cd ${this.targetDir} && node ${this.jspmPath} install -y`);
        done.resolve();
        return done.promise;
    }
    /**
     * creates bundle for production
     */
    createBundle(targetDirArg = this.targetDir, buildFile = 'main.js') {
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(targetDirArg);
        this.writeJspmPackageJson();
        plugins.shelljs.exec(`cd ${this.targetDir} && node ${this.jspmPath} build ${buildFile} -y`);
        done.resolve();
        return done.promise;
    }
    /**
     * Installs all npm dependencies into the root of the development directory so IDE picks up TypeScript
     */
    installNpmDevDir() {
        let installString = 'npm install';
        let installDir;
        if (this.npmDevDir) {
            installDir = this.npmDevDir;
        }
        else {
            installDir = this.targetDir;
        }
        for (let dependency of this.dependencyArray) {
            installString = installString + ` ${dependency.name}@${dependency.version}`;
        }
        plugins.shelljs.exec(`cd ${installDir} && ${installString}`);
    }
    /**
     * reads the dependencies from a source
     */
    readNpmextraJspmDependencies(npmExtraDirArg) {
        let localNpmextra = new plugins.npmextra.Npmextra(npmExtraDirArg);
        let dependencyData = localNpmextra.dataFor('smartjspm', {});
        if (dependencyData.npm) {
            for (let dependency in dependencyData.npm) {
                let dependencyObject = {
                    name: dependency,
                    version: dependencyData.npm[dependency],
                    registry: 'npm'
                };
                this.dependencyArray.push(dependencyObject);
            }
        }
    }
    /**
     * write jspmPackage.json
     */
    writeJspmPackageJson() {
        let jspmDependencyObject = {};
        for (let dependency of this.dependencyArray) {
            if (dependency.registry === 'npm') {
                jspmDependencyObject[dependency.name] = `npm:${dependency.name}@${dependency.version}`;
            }
            else {
                plugins.beautylog.error(`unsupported registry ${dependency.registry}`);
            }
        }
        let packageJsonObject = {
            jspm: {
                dependencies: jspmDependencyObject
            }
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(packageJsonObject), plugins.path.join(this.targetDir, 'package.json'));
    }
}
exports.SmartJspm = SmartJspm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQThDO0FBRTlDLHVCQUFzQjtBQW9CdEI7SUFRSSxZQUFZLFVBQXdDO1FBTHBELG9CQUFlLEdBQXNCLEVBQUUsQ0FBQTtRQUN2QyxhQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQy9DLFNBQVMsQ0FDWixDQUFBO1FBRUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBUSxDQUFBO1FBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLFlBQVksSUFBSSxDQUFDLFFBQVEsYUFBYSxDQUFDLENBQUE7UUFDaEYsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsR0FBVyxT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