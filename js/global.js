document.addEventListener("DOMContentLoaded", function(event) {

    const ManufacturerSelect = document.getElementById("car-brand-one");
    const ModelSelect = document.getElementById("car-model-one");
    const ManufacturerSecondSelect = document.getElementById("car-brand-second");
    const ModelSecondSelect = document.getElementById("car-model-second");

    function getManufacturer(selectElement) {
        
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

    function setSelectModelByManufacturerID(selectNodeElement, ManufacturerID) {
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


    ManufacturerSelect.addEventListener("change", function() {
        setSelectModelByManufacturerID(ModelSelect, this.selectedOptions[0].value);
    });

    ManufacturerSecondSelect.addEventListener("change", function() {
        setSelectModelByManufacturerID(ModelSecondSelect, this.selectedOptions[0].value);
    });



});