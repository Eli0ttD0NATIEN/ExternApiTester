const FileParser = require('./fileParser');
const Execute = require('./executeClass');
const TestGroup = require('./testGroup');
const path = require('path');
const fs = require('fs');

class TestMotor{
    constructor(config){
        this.config = config;
        this.executeInstance = new Execute(this.config);
        this.toExecute = this.executeInstance.getFileToExecute();
        this.allTestFiles = this.listTestFiles();
        this.allTestData = this.getAllTestData();
        this.allTestSeries = this.createAllTestSeries();
    }
    listTestFiles = () => {
        let files = [];
        fs.readdirSync(this.config.testFolder).forEach(file => {
             if(path.extname(file) == '.json' && file != 'Execute.json' && this.toExecute.includes(file)){
                 files.push(file);
             }
        });
        return files;
    }
    getAllTestData = () => {
        let allTestData = []
        this.allTestFiles.forEach(file => {
            let fileParser = new FileParser(file, this.config);
            let fileData = fileParser.getData();
            allTestData.push(fileData);
        });
        return allTestData
    }
    getTestFromFileAndId = (filename, id) => {
        for(let file of this.allTestFiles){
            if(file == filename){
                let index = this.allTestFiles.indexOf(file);
                let fileTest = this.allTestData[index];
                for(let caseTest of fileTest.all_test){
                    if(caseTest.id == id){
                        return caseTest;
                    }
                }
            }
        }
    }
    createAllTestSeries = () => {
        let allTestSeries = []
        this.executeInstance.getAllTestSeries().forEach(testSerie => {
            let testCaseGroup = [];
            testSerie.executionOrder.forEach(obj => {
                testCaseGroup.push(this.getTestFromFileAndId(obj.file, obj.id))
            });
            allTestSeries.push(testCaseGroup);
        })
        return allTestSeries;
    } 
    createTestGroup = () => {
        
    }
}
module.exports = {TestMotor};