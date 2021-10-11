document.getElementById('u1').addEventListener('click', () => {team(1)})
document.getElementById('u2').addEventListener('click', () => {team(2)})
document.getElementById('u3').addEventListener('click', () => {team(3)})
document.getElementById('addPromotorBtn').addEventListener('click', addPromotor)
document.getElementById('deletePromotorBtn').addEventListener('click', deletePromotor)
let promotrs = 0;
function team(val){
    switch(val){
            case 1:
                document.getElementById('u1-container').style.display = 'inline-block';
                document.getElementById('u2-container').style.display = 'none';
                document.getElementById('u3-container').style.display = 'none';
                document.getElementById('explanation').style.display = 'none';
            break;
            case 2:
                document.getElementById('u1-container').style.display = 'inline-block';
                document.getElementById('u2-container').style.display = 'inline-block';
                document.getElementById('u3-container').style.display = 'none';
                document.getElementById('explanation').style.display = 'none';
            break;
            case 3:
                document.getElementById('u1-container').style.display = 'inline-block';
                document.getElementById('u2-container').style.display = 'inline-block';
                document.getElementById('u3-container').style.display = 'inline-block';
                document.getElementById('explanation').style.display = 'inline-block';
            break;
    }
    
}
function addPromotor(){
    if(promotrs < 11){
    promotrs++;
    let newDiv = document.createElement('div');
    document.getElementById('promotrs-number').value++;
    newDiv.setAttribute('id',`promotor${promotrs}`);
    newDiv.classList.add('promotor-container')
    newDiv.innerHTML = `<label for="p${promotrs}Name">Imię</label><br>
            <input type="text" id="p${promotrs}Name" name="p${promotrs}Name"><br>
            <label for="p${promotrs}Surname">Nazwisko</label><br>
<input type="text" id="p${promotrs}Surname" name="p${promotrs}Surame"><br>
            <label for="p${promotrs}Email">Email</label><br>
            <input type="email" id="p${promotrs}Email" name="p${promotrs}Email"><br>
            <label for="p${promotrs}Tel">Numer telefonu</label><br>
            <input type="tel" id="p${promotrs}Tel" name="p${promotrs}Tel"><br>`;
    document.getElementById('promotor-container').appendChild(newDiv);
    }
}

function deletePromotor(){
    if(promotrs > 0){
        document.getElementById(`promotor${promotrs}`).remove();
        document.getElementById('promotrs-number').value--;
        promotrs--;
    }
}