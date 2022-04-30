let reservations;
function getReservationsAndRender(firstRender){
    fetch('https://frontend.tabling.co.kr/v1/store/9533/reservations')
    .then(reservations => reservations.json())
    .then(data => {
        reservations = data.reservations.filter(reservation => reservation.status !== 'done');
        firstRender()
    })
}

function exitCustomer(index){
    const copyReservations = JSON.parse(JSON.stringify(reservations))
    copyReservations.splice(index,1)
    reservations = copyReservations
}
function seatOrExit(index){
    event.stopPropagation();
    const isExit = event.target.innerText === '퇴석'
    if(isExit){
        exitCustomer(index)
        renderReservations()
    }else{
        event.target.classList.remove('btn')
        event.target.classList.add('btnWhite')
        event.target.textContent = '퇴석'
    }
}
function toggleModal(){
    const reservationDetailBox = document.getElementById("info-right")
    const wrap = document.getElementById('info-right-wrap')
    const closeBtn = document.getElementById('close')
    reservationDetailBox.classList.toggle('on')
    wrap.classList.toggle('on')
    closeBtn.classList.remove('off')
}
function reservationsToHtmlElement(){
    const result = reservations.map((reservation,index) => `
    <div onclick="renderReservationDetail(${index})" class="info-left-item">
        <div>
            <p>${reservation.timeReserved.split(' ')[1].slice(0,-3)}</p>
            <p style="color:${reservation.status==='seated'?'#162149':'#3BB94C'}">
            ${reservation.status==='seated'?'착석 중' : '예약'}
            </p>
        </div>
        <div>
            <div>${reservation.customer.name}-${reservation.tables.map(table=>`${table.name}`).join(',')}</div>
            <div>성인${reservation.customer.adult} 아이${reservation.customer.child}</div>
            <div>${reservation.menus.map(menu => `${menu.name}(${menu.qty})`).join(',')}</div>
        </div>
        <button onclick="seatOrExit(${index})" class="${reservation.status==='seated'?'btnWhite':'btn'}">
        ${reservation.status==='seated'?'퇴석':'착석'}
        </button>
    </div>
    `)
    return result
}
function reservationDetailToHtmlElement(index){
    const reservationDetail = reservations[index]
    const reservation = {
        '예약 상태':reservationDetail.status==='seated' ? '착석 중' : '예약',
        '예약 시간':reservationDetail.timeReserved.split(' ')[1].slice(0,-3),
        '접수 시간':reservationDetail.timeRegistered.split(' ')[1].slice(0,-3)
    }
    const customer = {
        '고객 성명':reservationDetail.customer.name,
        '고객 등급':reservationDetail.customer.level,
        '고객 메모':reservationDetail.customer.memo,
        '요청 사항':reservationDetail.customer.request
    }
    let template=`
    <div class="info-right-content">
        <h3>예약 정보<button onclick="toggleModal()" id="close" class="off">닫기</button></h3>
    ${
        Object.entries(reservation).map(keyAndValue => `
        <div class="reserve">
        <div>${keyAndValue[0]}</div>
        <div>${keyAndValue[1]}</div>
        </div>
        `).join('')
    }
    </div>
    <div class="info-right-content">
        <h3>고객 정보</h3>
    ${
        Object.entries(customer).map(keyAndValue => `
        <div class="reserve">
        <div>${keyAndValue[0]}</div>
        <div>${keyAndValue[1]}</div>
        </div>
        `).join('')
    }
    </div>
    `
    return template
}

function renderReservations(){
    const reservationsBox = document.getElementById('info-left')
    reservationsBox.innerHTML = reservationsToHtmlElement().join('')

}
function renderReservationDetail(index){
    const reservationDetail = reservationDetailToHtmlElement(index)
    const reservationDetailBox = document.getElementById('info-right')
    reservationDetailBox.innerHTML=reservationDetail

    if(window.innerWidth <= 1024){
        toggleModal()
    }
}
function firstRender(){
    const container = document.getElementById('container');
    const reservations = reservationsToHtmlElement()
    const reservationDetail = reservationDetailToHtmlElement(0)
    let template = `
        <h1>예약 목록</h1>
        <div onclick="toggleModal()" id="info-right-wrap"></div>
        <div id="info-box">
            <div id="info-left">
                ${reservations.join('')}
            </div>
            <div id="info-right">
                ${reservationDetail}
            </div>
        </div>
    `
    container.innerHTML=template;
}

getReservationsAndRender(firstRender)