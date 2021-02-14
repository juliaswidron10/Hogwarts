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
                middlename = middlename.toLowerCase()
                middlename = middlename.trim();
                middlename = middlename.charAt(0).toUpperCase()+middlename.slice(1);
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

        firstname = firstname.toLowerCase();
        firstname = firstname.charAt(0).toUpperCase()+firstname.slice(1);
        firstname = firstname.trim();
        lastname = lastname.toLowerCase();
        lastname = lastname.trim();
        lastname = lastname.charAt(0).toUpperCase()+lastname.slice(1);
        
        console.log(`${firstname} ${lastname} ${middlename} ${nickname}`)

        //cleaning up houses
        house = student.house;
        house = house.toLowerCase();
        house = house.trim();
        house = house.charAt(0).toUpperCase()+house.slice(1);

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
