const {contextBridge, dialog} = require('electron')
const fs = window.require('fs')

contextBridge.exposeInMainWorld('fileDo', {
    read: () => {
        let obj = {categories: {"Raw Materials": {categories: {}, items: []}, "Semi-finished Materials": {categories: {}, items: []}, "Finished Meal": {categories: {}, items: []}}, items: []}
        try{
            obj = JSON.parse(fs.readFileSync('data.json', 'utf16le').toString())
        }catch(e){
            fs.writeFile('data.json', JSON.stringify(obj), 'utf16le', function(err) {
                if (err) throw err;
                console.log('complete');
            });    
        }
        return obj
    },
    write: (data) => {
        fs.writeFile('data.json', JSON.stringify(data), 'utf16le', function(err) {
            if (err) throw err;
            console.log('complete');
        });
    }
})
