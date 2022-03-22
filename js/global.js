document.addEventListener("DOMContentLoaded", function(event) {

    const ManufacturerSelect = document.getElementById("car-brand-one");
    const YearSelect = document.getElementById("car-year-one");
    const ModelSelect = document.getElementById("car-model-one");

    const ManufacturerSecondSelect = document.getElementById("car-brand-second");
    const YearSecondSelect = document.getElementById("car-year-second");
    const ModelSecondSelect = document.getElementById("car-model-second");

    carqueryapiToJSON = (response) => JSON.parse(response.substring(2, response.length -2)); // remove first two leters "?(" character and last ");" from API reponse as text    

    range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    setStateElement = (element, clearElement = true) => { 

        if (clearElement) {
            element.disabled = true;
            element.innerText.null
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

                for ( let i = 0; i < years.length; i++) {
                    selectYear.options[i] = new Option( years[i],  years[i]);
                }

                setStateElement(selectModel);
            }
        )  
        .catch((error) => {
            console.error('Error:', error);
        }); 
    }

    getManufacturer = (selectManufacturer, selectModel, year) => {

        setStateElement(selectManufacturer, false);
        
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year='+year)
        .then(response => response.text())
        .then(text => {            
            let data = carqueryapiToJSON(text);

            data.Makes.forEach(function (option, i) {
                selectManufacturer.options[i] = new Option(option.make_display, option.make_id);
            });

            setStateElement(selectModel);
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

    renderDataModel = (data) => Object.keys(data).forEach(e=>(data+': '+data[e]));

    getModelData = (ModelID) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModel&model='+ModelID)
        .then(response => response.text())
        .then(text => {           
            let data = carqueryapiToJSON(text);
            console.log(data)
            data = JSON.parse(data);
            console.log(data)
            
            data.forEach(function (option, i) {
                console.log(renderDataModel(option))
            });

            //console.log(renderDataModel(data))

            // data.Trims.forEach(function (option, i) {
            //     selectNodeElement.options[i] = new Option(option.model_name + ' ' + option.model_trim + ', (HP: '+option.model_engine_power_ps+')', option.model_id);
            // });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    setAvailableYears(YearSelect, ManufacturerSelect, ModelSelect);
    setAvailableYears(YearSecondSelect, ManufacturerSecondSelect, ModelSecondSelect);


    // First group of selector

    YearSelect.addEventListener("change", () => {
        getManufacturer(ManufacturerSelect, ModelSelect, YearSelect.value);
    });

    ManufacturerSelect.addEventListener("change", () => {
        setSelectModelByManufacturerID(ModelSelect, ManufacturerSelect.value, YearSelect.value);
    });

    ModelSelect.addEventListener("change", () => {
        getModelData(ModelSelect.value);
    });

    // Second group of selector

    YearSecondSelect.addEventListener("change", () => {
        getManufacturer(ManufacturerSecondSelect, YearSecondSelect.value);
    });

    ManufacturerSecondSelect.addEventListener("change", () => {
      setSelectModelByManufacturerID(ModelSecondSelect, ManufacturerSecondSelect, YearSecondSelect.value);
    });

    ModelSecondSelect.addEventListener("change", () => {
        getModelData(ModelSecondSelect.value);
    });

});