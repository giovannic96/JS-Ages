var PeopleController = (function() {

    var People = function(id, name, surname, birthDate) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
    }

    People.prototype.getAge = function() {
        var ageDifMs = Date.now() - parseDate(this.birthDate).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    var parseDate = function(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }

    var allPeople = [];

    return {

        addPeople: function(name, surname, birth) {
            
            var person, id;

            if(allPeople.length > 0) {
                id = allPeople[allPeople.length-1].id + 1;
            } else {
                id = 0;
            }

            person = new People(id, name, surname, birth);
            allPeople.push(person);
            
            return person;
        },

        deletePeople: function(id) {

            var ids, index;

            ids = allPeople.map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                allPeople.splice(index, 1);
            }
        }
    }

})();

var UIController = (function() {

    var DOMStrings = {
        inputBtn: '.add__btn',
        inputName: '.add__name',
        inputSurname: '.add__surname',
        inputDate: '.add__date',
        inputList: '.people__list'
    }

    return {
        getDOM: function() {
            return DOMStrings;
        },

        getInput: function() {
            return {
                name: document.querySelector(DOMStrings.inputName).value,
                surname: document.querySelector(DOMStrings.inputSurname).value,
                date: document.querySelector(DOMStrings.inputDate).value
            }
        },

        addListPerson: function(person) {

            var html, newHtml;

            html = '<div class="item clearfix" id="person-%id%"><div class="item__description">%name%&emsp;&emsp;%surname%&emsp;&emsp;%birth%&emsp;&emsp;%age%</div><div class="right clearfix"><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';            

            newHtml = html.replace('%id%', person.id);
            newHtml = newHtml.replace('%name%', person.name);
            newHtml = newHtml.replace('%surname%', person.surname);
            newHtml = newHtml.replace('%birth%', person.birthDate);
            newHtml = newHtml.replace('%age%', person.getAge());

            document.querySelector(DOMStrings.inputList).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListPerson: function(id) {

            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        }
    }
})();

var controller = (function(PeopleCtrl, UICtrl) {

    var ctrlAddPerson = function() {

        var input, person;

        // 1. Get input from the input field
        input = UICtrl.getInput();
       
        // 2. Add people to the list 
        person = PeopleCtrl.addPeople(input.name, input.surname, input.date);

        // 3. Show list (UI) on the bottom panel 
        UICtrl.addListPerson(person);
        
    }

    var ctrlDeletePerson = function(event) {

        var itemID, splitID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');

            PeopleCtrl.deletePeople(parseInt(splitID[1]));

            UICtrl.deleteListPerson(itemID);
        }
    }

    var setupEventListener = function() {

        var DOM = UICtrl.getDOM();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddPerson);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddPerson();
            }
        });
        document.querySelector(DOM.inputList).addEventListener('click', ctrlDeletePerson);
    }

    return {
        init: function() {
            setupEventListener();
        }
    }
})(PeopleController, UIController);

controller.init();