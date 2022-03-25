document.addEventListener("DOMContentLoaded", function(event) {

    const car = {
        year: '',
        manufacturer: '',
        modelID: ''
    }

    const ManufacturerSelect = document.getElementById("car-brand-one");
    const YearSelect = document.getElementById("car-year-one");
    const ModelSelect = document.getElementById("car-model-one");
    const DataModelElement = document.getElementById("car-information-one");

    const ManufacturerSecondSelect = document.getElementById("car-brand-second");
    const YearSecondSelect = document.getElementById("car-year-second");
    const ModelSecondSelect = document.getElementById("car-model-second");
    const DataModelSecondElement = document.getElementById("car-information-second");

    carqueryapiToJSON = (response) => JSON.parse(response.substring(2, response.length -2)); // remove first two leters "?(" character and last ");" from API reponse as text    

    range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    setStateElement = (element, clearElement = true) => { 

        if (clearElement) {
            element.disabled = true;
            element.innerText = null;
            element.options[0] = new Option(element.dataset.label);
            element.options[0].selected = true;
        } else {
            element.disabled = false;
        }
    }

    setAvailableYears = (selectYear, selectModel, selectManufactuer) => {

        setStateElement(selectYear, false);
        setStateElement(selectManufactuer)
        
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears')
        .then(response => response.text()) //text: ({ "Years": {"min_year":"1941", "max_year":"2022"} });
        .then(text => {            
                let data = carqueryapiToJSON(text);

                let years = range(parseInt(data.Years.min_year), parseInt(data.Years.max_year));

                years.forEach((years, index) => {
                    selectYear.options[index] = new Option(years)
                });

                setStateElement(selectModel);
            }
        )  
        .catch((error) => {
            console.error('Error:', error);
        }); 
    }

    getManufacturer = (selectManufacturer, selectModel, dataElement, year) => {

        setStateElement(selectManufacturer, false);
        
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year='+year)
        .then(response => response.text())
        .then(text => {            
            let data = carqueryapiToJSON(text);

            data.Makes.forEach(function (option, i) {
                selectManufacturer.options[i] = new Option(option.make_display, option.make_id);
            });

            setStateElement(selectModel);
            dataElement.innerText = null;
          })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    setSelectModelByManufacturerID = (selectElement, ManufacturerID, year) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make='+ManufacturerID+'&year='+year)
        .then(response => response.text())
        .then(text => {            
            let data = carqueryapiToJSON(text);

            setStateElement(selectElement, false);

            data.Trims.forEach(function (option, i) {
                let label = option.model_name;
                label += option.model_trim ? ' '+ option.model_trim : "";
                label += option.model_engine_power_ps ? ', HP: '+ option.model_engine_power_ps : "";
                selectElement.options[i] = new Option(label, option.model_id);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    getModelData = (ModelID, dataElement) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModel&model='+ModelID)
        .then(response => response.text())
        .then(text => {            
            let data = carqueryapiToJSON(text);
            let JSONData = data[0]; // for some reason API return it different that the rest of stuff

            let rows = '<ol class="list-group list-group">';
            for (const key in JSONData) {
                if(JSONData[key]) {
                    rows += '<li class="list-group-item d-flex justify-content-between align-items-start">';
                    let keyData = key.replace("model_", "").replaceAll("_"," ");
                    keyData = keyData.charAt(0).toUpperCase() + keyData.slice(1);
                    rows += '<div class="fw-bold">'+ keyData +'</div>';
                    rows += JSONData[key];
                    rows += '</li>';
                }
              }
            rows += '</ol>';

            dataElement.innerHTML = rows;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // First group of selector
    setAvailableYears(YearSelect, ManufacturerSelect, ModelSelect);

    YearSelect.addEventListener("change", () => {
        getManufacturer(ManufacturerSelect, ModelSelect, DataModelElement, YearSelect.value);
    });

    ManufacturerSelect.addEventListener("change", () => {
        setSelectModelByManufacturerID(ModelSelect, ManufacturerSelect.value, YearSelect.value);
    });

    ModelSelect.addEventListener("change", () => {
        getModelData(ModelSelect.value, DataModelElement);
        car.year = YearSelect.value;
        car.manufacturer = ManufacturerSelect.value;
        car.modelID = ModelSelect.value;
        window.localStorage.setItem('ModelFirst', JSON.stringify(car));
    });

    // Second group of selector
    setAvailableYears(YearSecondSelect, ManufacturerSecondSelect, ModelSecondSelect);

    YearSecondSelect.addEventListener("change", () => {
        getManufacturer(ManufacturerSecondSelect, ModelSecondSelect, DataModelSecondElement, YearSecondSelect.value);
    });

    ManufacturerSecondSelect.addEventListener("change", () => {
      setSelectModelByManufacturerID(ModelSecondSelect, ManufacturerSecondSelect.value, YearSecondSelect.value);
    });

    ModelSecondSelect.addEventListener("change", () => {
        getModelData(ModelSecondSelect.value, DataModelSecondElement);
        car.year = YearSecondSelect.value;
        car.manufacturer = ManufacturerSecondSelect.value;
        car.modelID = ModelSecondSelect.value;
        window.localStorage.setItem('ModelSecond', JSON.stringify(car));
    });

});