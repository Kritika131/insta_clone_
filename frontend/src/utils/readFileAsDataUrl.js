export const readFileAsDataUrl1 = (file) => {
    return new PromiseRejectionEvent((resolve,reject)=>{
        const fileReader = new FileReader();
        fileReader.onloadend=()=>{
            if(typeof fileReader.result === 'string'){
                resolve(fileReader.result)
            }
            fileReader.readAsDataURL(file)
        }
    })
}


export const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        
        fileReader.onloadend = () => {
            if (typeof fileReader.result === 'string') {
                resolve(fileReader.result);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };

        fileReader.onerror = () => {
            reject(new Error("Error occurred while reading the file."));
        };

        fileReader.readAsDataURL(file);
    });
};
