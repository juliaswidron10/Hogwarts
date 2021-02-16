"use strict";
const listOfStudents=[];
document.addEventListener("DOMContentLoaded", start);

const HTML = {};

function start() {
    fetchdata();

    // HTML.
}


function fetchdata() {
    fetch('https://petlatkea.dk/2021/hogwarts/students.json')
    .then(function(response){
        console.log('Student data fetched!');
        return response.json();
    })
    .then(function(data){
        console.log(data);
        dataRecived(data)
    })
    function dataRecived(actors){
        actors.forEach(createStudents)
    }
};


function createStudents(student) {
   
        const Student = {
            name:'',
            middlename:'',
            lastname: '',
            nickname:'',
            image:'',
            house:''
        }
        const newStudent = Object.create(Student);

        let fullname =  student.fullname.trim();
        let firstname;
        let lastname;
        let nickname='';
        let middlename;
        let house;

        fullname = fullname.replace('-',' ');

        //cleaning up names 
        if(fullname.includes(' ')){
            let firstnameEnd = fullname.indexOf(' ');
            let lastnameStart = fullname.lastIndexOf(' ');
            firstname = fullname.substring(0, firstnameEnd);
            lastname = fullname.substring(lastnameStart,);

            if(firstnameEnd !== lastnameStart){
                middlename = fullname.substring(firstnameEnd, lastnameStart);
                if(middlename.includes('"')){
                    nickname = middlename.replace('"', ' ');
                    nickname = nickname.replace('"', ' ');
                    nickname = nickname.trim();
                    nickname = nickname.charAt(0).toUpperCase()+nickname.slice(1);
                    middlename = '';

                }else{
                    nickname = '';
                }
            }else{
                middlename = ''
            }

        }else{
            firstname = fullname; 
            lastname = 'Unknown';
            middlename = '';
            nickname = '';
        }


        function cleanUp(str){
            str = str.trim();
            str = str.toLowerCase();
            str = str.charAt(0).toUpperCase()+str.slice(1);
            return str;
        };
        firstname = cleanUp(firstname);
        middlename = cleanUp(middlename);
        lastname = cleanUp(lastname);

        console.log(`${firstname} ${lastname} ${middlename} ${nickname}`)

        //cleaning up houses
        house = cleanUp(student.house);

        // creating student objects 
        newStudent.firstname = firstname;
        newStudent.gender = student.gender;
        newStudent.lastname = lastname;
        newStudent.middlename = middlename;
        newStudent.nickname = nickname;
        newStudent.house = house;
        newStudent.image = `images/${lastname.toLowerCase()}_${firstname.charAt(0).toLowerCase()}.png`;

        listOfStudents.push(newStudent);
    }
    console.log(listOfStudents);
