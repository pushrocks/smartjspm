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
        let jspmConfigJs = plugins.smartfile.fs.toStringSync(plugins.path.join(this.targetDir, 'jspm.config.js'));
        let jspmConfigPrefix = plugins.smartstring.indent.normalize(`
            SystemJS.config({
                packages: {
                    app: {
                        main: './main.js',
                        defaultExtension: 'js'
                    }
                }
            });
        `);
        let appJSConfigRegex = /app:.*{\n\s*main:/;
        if (!appJSConfigRegex.test(jspmConfigJs)) {
            jspmConfigJs = jspmConfigPrefix + jspmConfigJs;
            plugins.smartfile.memory.toFsSync(jspmConfigJs, plugins.path.join(this.targetDir, 'jspm.config.js'));
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQThDO0FBRTlDLHVCQUFzQjtBQW9CdEI7SUFRSSxZQUFZLFVBQXdDO1FBTHBELG9CQUFlLEdBQXNCLEVBQUUsQ0FBQTtRQUN2QyxhQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQy9DLFNBQVMsQ0FDWixDQUFBO1FBRUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBUSxDQUFBO1FBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLFlBQVksSUFBSSxDQUFDLFFBQVEsYUFBYSxDQUFDLENBQUE7UUFDaEYsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1FBQ3pHLElBQUks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