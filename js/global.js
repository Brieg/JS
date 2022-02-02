document.addEventListener("DOMContentLoaded", function(event) {

    const Car = function (manufacturer, model, engineData) {
        this.manufacturer = manufacturer;
        this.model = model;
        this.engineData = {engineData};
    };
      
    Car.prototype.get_manufacturer = function () {
        return this.manufacturer;
    }

    Car.prototype.get_model = function () {
        return this.model;
    }

    Car.prototype.get_engideData = function () {
        return this.engineData;
    }

    const ManufacturerSelect = document.getElementById("car-brand-one");
    const ModelSelect = document.getElementById("car-model-one");
    const ManufacturerSecondSelect = document.getElementById("car-brand-second");
    const ModelSecondSelect = document.getElementById("car-model-second");

    async function getManufacturer(selectElement) {
        
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

    getManufacturer(ManufacturerSelect);
    getManufacturer(ManufacturerSecondSelect);

    function setSelectModelByManufacturerID(slecetElement, ManufacturerID) {
        if(!isNaN(ManufacturerID)) {
            fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/'+ManufacturerID+'?format=json')
            .then(response => response.json())
            .then(data => {
                slecetElement.innerHTML = null;
                slecetElement.removeAttribute("disabled");

                data.Results.forEach(function (option, i) {
                    slecetElement.options[i] = new Option(option.Model_Name, option.Model_ID);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    ManufacturerSelect.onchange = function(){
        setSelectModelByManufacturerID(ModelSelect, this.selectedOptions[0].value);
    };

    ManufacturerSecondSelect.onchange = function(){
        setSelectModelByManufacturerID(ModelSecondSelect, this.selectedOptions[0].value);
    };



});