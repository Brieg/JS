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
                selectElement.options[i] = new Option(option.MakeName, option.MakeId);
            });
          })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    setSelectModelByManufacturerID = (selectNodeElement, ManufacturerID) => {
        if(!isNaN(ManufacturerID)) {
            fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/'+ManufacturerID+'?format=json')
            .then(response => response.json())
            .then(data => {
                selectNodeElement.innerHTML = null;
                selectNodeElement.removeAttribute("disabled");

                data.Results.forEach(function (option, i) {
                    selectNodeElement.options[i] = new Option(option.Model_Name, option.Model_ID);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    setAvailableYears = (selectElement) => {
        fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears')
        .then(response => response.text())
        .then(text => {
                //text: ({ "Years": {"min_year":"1941", "max_year":"2022"} });
                let data = text.substring(2, text.length -2); // remove first two leters "?(" character and last ");" from API reponse
                data = JSON.parse(data);

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


    getManufacturer(ManufacturerSelect);
    getManufacturer(ManufacturerSecondSelect);


    

    ManufacturerSelect.addEventListener("change", function() {
        setAvailableYears(YearSelect);
    });

    ManufacturerSecondSelect.addEventListener("change", function() {
        setAvailableYears(YearSecondSelect);
    });


    // ManufacturerSelect.addEventListener("change", function() {
    //     setSelectModelByManufacturerID(ModelSelect, this.selectedOptions[0].value);
    // });

    // ManufacturerSecondSelect.addEventListener("change", function() {
    //     setSelectModelByManufacturerID(ModelSecondSelect, this.selectedOptions[0].value);
    // });



});