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

    async function getManufacturer(selectId) {
        let select = document.getElementById(selectId);

        fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
        .then(response => response.json())
        .then(data => {
            data.Results.forEach(function (option, i) {
                select.options[i] = new Option(option.MakeName, option.MakeId);
            });
          })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    getManufacturer('car-brand-one');
    getManufacturer('car-brand-second');



});