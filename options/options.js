document.getElementById('upload-button').addEventListener('click', function() {
    var fileInput = document.getElementById('json-file');
    var uploadResult = document.getElementById('upload-result');
    
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                let dict = JSON.parse(e.target.result);
                Object.entries(dict).forEach(([k, v]) => {
                    let obj = {}
                    obj[k] = v

                    chrome.storage.local.set(obj)
                    console.log(obj);
                })
                console.log(dict)
                console.log("Ответы загружены");
                uploadResult.textContent = "Ответы успешно загружены!";
                uploadResult.style.color = "green";
            } catch (e) {
                console.error('Ошибка загрузки файла', e);
                uploadResult.textContent = `Ошибка загрузки файла: ${e}`;
                uploadResult.style.color = "red";
            }
        };
        reader.readAsText(file);
    } else {
        console.log("Файл не выбран!");
        uploadResult.textContent = "Пожалуйста, выберите файл.";
        uploadResult.style.color = "red";
    }
});

document.querySelector("#json-file").onchange = function() {
    const fileName = this.files[0]?.name;
    const label = document.querySelector("label[for=json-file]");
    label.innerText = fileName ?? "Выбрать файл";
};