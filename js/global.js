document.addEventListener("DOMContentLoaded", function(event) {

    const ManufacturerSelect = document.getElementById("car-brand-one");
    const ModelSelect = document.getElementById("car-model-one");
    const YearSelect = document.getElementById("car-year-one");

    const ManufacturerSecondSelect = document.getElementById("car-brand-second");
    const ModelSecondSelect = document.getElementById("car-model-second");
    const YearSecondSelect = document.getElementById("car-year-second");

    getManufacturer = (selectElement) => {
        
        fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
        .then(response => response.json())
        .then(data => {
            selectElement.removeAttribute("disabled");
            data.Results.forEach(function (option, i) {
                selectElement.options[i] = new Option(option.MakeName, option.MakeName);
            });
          })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    carqueryapiToJson = (response) => JSON.parse(response.substring(2, response.length -2)); // remove first two leters "?(" character and last ");" from API reponse
    

    setAvailableYears = (selectElement) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears')
        .then(response => response.text()) //text: ({ "Years": {"min_year":"1941", "max_year":"2022"} });
        .then(text => {            
                let data = carqueryapiToJson(text);

                selectElement.innerHTML = null;
                selectElement.removeAttribute("disabled");

                let years = range(parseInt(data.Years.min_year), parseInt(data.Years.max_year));

                for ( let i = 0; i < years.length; i++) {
                    selectElement.options[i] = new Option( years[i],  years[i]);
                }
            }
        )  
        .catch((error) => {
            console.error('Error:', error);
        }); 
    }

    setSelectModelByManufacturerID = (selectNodeElement, ManufacturerID, year) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make='+ManufacturerID+'&min_year='+year+'&max_year=2022')
        .then(response => response.text())
        .then(text => {            
            let data = carqueryapiToJson(text);

            selectNodeElement.innerHTML = null;
            selectNodeElement.removeAttribute("disabled");

            data.Trims.forEach(function (option, i) {
                selectNodeElement.options[i] = new Option(option.model_name + ' ' + option.model_trim + ', (HP: '+option.model_engine_power_ps+')', option.model_id);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }

    // https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=Opel&year=1941

    getManufacturer(ManufacturerSelect);
    getManufacturer(ManufacturerSecondSelect);    

    ManufacturerSelect.addEventListener("change", () => {
        setAvailableYears(YearSelect);
    });

    ManufacturerSecondSelect.addEventListener("change", () => {
        setAvailableYears(YearSecondSelect);
    });


    YearSelect.addEventListener("change", () => {
       setSelectModelByManufacturerID(ModelSelect, ManufacturerSelect.value, YearSelect.value);
    });

    YearSecondSelect.addEventListener("change", () => {
      setSelectModelByManufacturerID(ModelSecondSelect, YearSelect.value);
    });



});