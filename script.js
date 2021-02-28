"use strict";
let listOfStudents = [];
let expelledStudents = [];
const password = "Password";
const login = "teacher001";
const form = document.querySelector('#loginpassword');
const filterhouse = document.querySelector(".househeading");
const sortinglist = document.querySelector('.sortbybutton');
let detailsOpened = false;
let inquisitorialSquad = [];


const housecolors = {
    Hufflepuff: '#F2CEA2',
    Ravenclaw: '#6CB0FF',
    Slytherin: '#7DED85',
    Gryffindor: '#FF6C6C',
}

document.addEventListener("DOMContentLoaded", start);

const HTML = {};

function start() {
    fetchdata();
    document.querySelector('.studen_login').addEventListener('click', validatePassword);
    document.querySelector('#loginButton').addEventListener('click', validatePassword);
    form.addEventListener("submit", validatePassword);
    document.querySelector('#searchstudent').addEventListener('keyup', filterStudents);

    filterh ouse.addEventListener('click', e => {
        document.querySelector('#listofhouses').classList.toggle('hide');
        document.querySelectorAll(".listfilter").forEach(e => {
            e.addEventListener('click', function () {
                filterhouses(e.textContent);
            })
        })
    });

    sortinglist.addEventListener('click', e => {
        document.querySelector('#listofsorting').classList.toggle('hide');
        document.querySelectorAll("#listofsorting > .listofsort").forEach(e => {
            e.addEventListener('click', function () {
                sortstudents(e.textContent);
            })
        })
        document.querySelectorAll("#listofsorting > .sortfilter").forEach(e => {
            e.addEventListener('click', function () {
                filterstudents(e.textContent);
            })
        })
    });

}

function validatePassword() {
    document.querySelector("#loginpopup").classList.add('hide');
    form.removeEventListener("submit", validatePassword);
    document.querySelector('#loginButton').removeEventListener('click', validatePassword);

    if (form.username.value===login && form.password.value === password) {
       
        document.querySelector('body').classList.add('teacherlogin')
        console.log('teacher logged in');
        // document.querySelector("#loginpopup").classList.add('hide');

    } else {

        // document.querySelector("#loginpopup").classList.add('hide');
        document.querySelector('body').classList.remove('teacherlogin');
        console.log('guest logged in');
    }

}


function fetchdata() {
    fetch('https://petlatkea.dk/2021/hogwarts/students.json')
        .then(function (response) {
            console.log('Student data fetched!');
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            dataRecived(data)
        })

};


function dataRecived(actors) {
    actors.forEach(createStudents);
    displayStudents(listOfStudents);
    getBloodTypes();
}


async function getBloodTypes() {
    let response = await fetch('https://petlatkea.dk/2021/hogwarts/families.json');
    let families = await response.json();
    changeBloodtype(families);
}

function changeBloodtype(families) {
    listOfStudents.forEach(e => {
        if (families.half.includes(e.lastname)) {
            e.blood = 'Half';
        };
        if (e.blood === 'Pure') {
            inquisitorialSquad.push(e);
            e.team = 'Inq Squad';
        }
    })
}

function createStudents(student) {

    const Student = {
        name: '',
        middlename: '',
        lastname: '',
        nickname: '',
        image: '',
        house: '',
        prefect: false,
        blood: 'Pure',
        team: 'None',
        expelled: false,
    }
    const newStudent = Object.create(Student);

    let fullname = student.fullname.trim();
    let firstname;
    let lastname;
    let nickname = '';
    let middlename;
    let house;

    fullname = fullname.replace('-', ' ');

    //cleaning up names 
    if (fullname.includes(' ')) {
        let firstnameEnd = fullname.indexOf(' ');
        let lastnameStart = fullname.lastIndexOf(' ');
        firstname = fullname.substring(0, firstnameEnd);
        lastname = fullname.substring(lastnameStart, );

        if (firstnameEnd !== lastnameStart) {
            middlename = fullname.substring(firstnameEnd, lastnameStart);
            if (middlename.includes('"')) {
                nickname = middlename.replace('"', ' ');
                nickname = nickname.replace('"', ' ');
                nickname = nickname.trim();
                nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1);
                middlename = '';

            } else {
                nickname = '';
            }
        } else {
            middlename = ''
        }

    } else {
        firstname = fullname;
        lastname = 'Unknown';
        middlename = '';
        nickname = '';
    }


    function cleanUp(str) {
        str = str.trim();
        str = str.toLowerCase();
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    };
    firstname = cleanUp(firstname);
    middlename = cleanUp(middlename);
    lastname = cleanUp(lastname);

    // console.log(`${firstname} ${lastname} ${middlename} ${nickname}`)

    //cleaning up houses
    house = cleanUp(student.house);

    // creating student objects 
    newStudent.firstname = firstname;
    newStudent.gender = student.gender;
    newStudent.lastname = lastname;
    newStudent.middlename = middlename;
    newStudent.nickname = nickname;
    newStudent.house = house;
    newStudent.expelled = false;

    listOfStudents.forEach( e => {
        if(newStudent.lastname  === lastname){
            // console.log(e.lastname);
            newStudent.image = `images/${lastname.toLowerCase()}_${firstname.toLowerCase()}.png`;
        }else if(lastname === 'Unknown'){
            newStudent.image = `images/Unknown.png`;
        }
        else{
            newStudent.image = `images/${lastname.toLowerCase()}_${firstname.charAt(0).toLowerCase()}.png`;
        }
    });
   

    listOfStudents.push(newStudent);
}

function displayStudents(students) {
    students.forEach(e => {
        const template = document.getElementById('stulist').content;
        const clone = template.cloneNode(true);

        clone.querySelector('.firstname').textContent = e.firstname;
        clone.querySelector('.lastname').textContent = e.lastname;
        clone.querySelector('.house').textContent = e.house;
        clone.querySelector('.listgeneral').setAttribute('id', `${e.firstname}${e.lastname}`);
        clone.querySelector('ul').addEventListener('click', function () {
            showDetailsModal(e.lastname)
        });
        if (e.expelled === true) {
            clone.querySelector('.listgeneral').style.color = '#515C6F';
        }
        document.querySelector("#students").appendChild(clone);
    })
    getStatistic(students);
}

function filterStudents(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.listgeneral').forEach(
        function (name) {
            let item = name.id;
            item = item.toLowerCase();
            (console.log(item))

            if (item.includes(text)) {
                name.style.display = 'block';
            } else {
                name.style.display = 'none';
            }
        })
}

function getStatistic(students) {
    let t = 0;
    let g = 0;
    let h = 0;
    let r = 0;
    let s = 0;
    let ex = 0;
    students.forEach(e => {
        t++;
        switch (e.house) {
            case 'Slytherin':
                s++;
                if (s <= 2) {
                    e.prefect = true;
                }
                break;
            case 'Ravenclaw':
                r++;
                if (r <= 2) {
                    e.prefect = true;
                }
                break;
            case 'Hufflepuff':
                h++;
                if (h <= 2) {
                    e.prefect = true;
                }
                break;
            default:
                g++;
                if (g <= 2) {
                    e.prefect = true;
                }
                if (e.expelled === 'true') {
                    ex++;
                }
        }
        document.querySelector('.statisticsHogwart').textContent = `Students total: ${t}; Gryfindor: ${g}; Hufflepuff: ${h}; Slytherin: ${s}; Ravenclaw: ${r}; Expelled Students: ${ex}`
    })
}



function showDetailsModal(lastname) {
    const modal = document.querySelector("#studentModal");
    if (detailsOpened === false) {
        modal.classList.remove('hide');

        modal.addEventListener('click', e => {
            modal.classList.add('hide');
            detailsOpened = true;
        })
        listOfStudents.forEach(e => {
            if (e.lastname === lastname) {
                modal.querySelector('img').src = e.image;
                modal.querySelector('.modalfirstname').textContent = `${e.firstname} ${e.lastname}`;
                modal.querySelector('.modalgender').textContent = e.gender;
                modal.querySelector('.housemodal').textContent = e.house;
                modal.querySelector('.modalblood').textContent = e.blood;
                modal.querySelector('.modalteam').textContent = e.team;

                if(document.querySelector('body').classList.contains('teacherlogin')){
                    modal.querySelector('.teacherprefect').addEventListener('click', function () {
                        editPrefect(e)
                    });
    
                    modal.querySelector('.teacherexpell').addEventListener('click', function () {
                        expellStudent(e)
                    });
                }else{
                    modal.querySelector('#teacherOptions').classList.add('hide');
                }
               


                switch (e.house) {
                    case 'Hufflepuff':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Hufflepuff} solid 6px`;
                        modal.querySelector('.isprefect').style.color = housecolors.Hufflepuff;
                        break;
                    case 'Ravenclaw':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Ravenclaw} solid 6px`;
                        modal.querySelector('.isprefect').style.color = housecolors.Ravenclaw;
                        break;
                    case 'Slytherin':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Slytherin} solid 6px`;
                        modal.querySelector('.isprefect').style.color = housecolors.Slytherin;
                        break;
                    default:
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Gryffindor} solid 6px`;
                        modal.querySelector('.isprefect').style.color = housecolors.Gryffindor;
                }

                if (e.prefect === false) {
                    modal.querySelector('.isprefect').classList.add('hide');
                    modal.querySelector('.teacherprefect').textContent = 'Prefect: NO';
                }

            }
        })
        detailsOpened = true;
    } else {
        modal.classList.add('hide');
        detailsOpened = false;
    }
}

function editPrefect(student) {
    let prefects = []
    console.log(student.prefect);

    listOfStudents.forEach(e => {
        if (e.prefect === true) {
            prefects.push(e);
        }
    })


    console.log(prefects);

    if (student.prefect === false) {
        student.prefect = true;
    } else {
        student.prefect = false;
    }
}

function expellStudent(student) {
    if (student.expelled === false) {
        if (student.firstname === 'Julia') {
            alert(`You are not allowed to expell ${student.firstname} ${student.lastname}`);
        } else {
            console.log(student);
            alert(`You expelled ${student.firstname} ${student.lastname}`);
            document.querySelector('.teacherexpell').textContent = "Expelled : YES";
            student.expelled = true;
            expelledStudents.push(student);
            cleanUpList();
            displayStudents(listOfStudents);
        }

    } else {
        student.expelled = false;
        document.querySelector('.teacherexpell').textContent = "Expelled : NO";
        cleanUpList();
        displayStudents(listOfStudents);

    }


};

function filterstudents(filterBy) {
    cleanUpList();
    let listToDisplay
    switch (filterBy) {
        case 'Girls':
            listToDisplay = listOfStudents.filter(student => student.gender === 'girl');
            break;
        case 'Boys':
            listToDisplay = listOfStudents.filter(student => student.gender === 'boy');
            break;
        case 'Pure Blood':
            listToDisplay = listOfStudents.filter(student => student.blood === 'Pure');
            break;
        default:
            listToDisplay = expelledStudents;
    }
    displayStudents(listToDisplay);
    console.log(listToDisplay)
}

function filterhouses(houseSort) {
    cleanUpList();
    console.log(houseSort);
    const listToDisplay = listOfStudents.filter(student => student.house === houseSort);
    displayStudents(listToDisplay);
    console.log(listToDisplay)
}

function sortstudents(sortBy) {
    cleanUpList();
    console.log(`${sortBy} pressed sorting`);

    if (sortBy === 'By Name') {
        listOfStudents.sort(compareFirstNames);
    } else {
        listOfStudents.sort(compareLastNames);
    }


    function compareFirstNames(a, b) {
        if (a.firstname < b.firstname) {
            return -1;
        } else {
            return 1
        }
    }

    function compareLastNames(a, b) {
        if (a.lastname < b.lastname) {
            return -1;
        } else {
            return 1
        }
    }
    console.log(listOfStudents);
    displayStudents(listOfStudents);
}

function cleanUpList() {
    const table = document.querySelector('#students');
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }
}

function hackTheSystem() {
    let Me = {
        firstname: 'Julia',
        middlename: 'Zofia',
        lastname: 'Swidron',
        nickname: 'J',
        image:  `images/Unknown.png`,
        house: 'Gryffindor',
        prefect: false,
        blood: 'Pure',
        team: 'Inq Squad',
        expelled: false,
    };
    listOfStudents.push(Me);
    

    listOfStudents.forEach(e=>{
        let randomNum = Math.floor(Math.random(0)*2);
        if (randomNum !== 0){
            e.blood = 'Pure';
            console.log(e.lastname)
            removefromSquad()
            removefromSquad(e.lastname)
        } else{
            e.blood = 'Half';
        }
    })
    cleanUpList();
    displayStudents(listOfStudents);
}

function removefromSquad(name){
    listOfStudents.forEach( e =>{
        if(name === e.lastname){
            let randomTimeout = (1000 * Math.floor(Math.random(6)*18));
            setTimeout( function(){
                inquisitorialSquad.splice(e);
                alert(`${e.firstname} ${e.lastname} got removed from Inquisiturial Squad`);
                e.team = 'None';
            } , randomTimeout );
        }
    })
}