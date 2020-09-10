import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function Subscribe(props) {

    const [SubsrcibeNumber, setSubsrcibeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        let variable = { userTo: props.userTo };

        // 비디오 업로드(작성)한 사용자의 ID를 넣으면 해당 사용자 구독자 수를 알 수 있다.
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data.subscribeNumber);
                    setSubsrcibeNumber(response.data.subscribeNumber);
                } else {
                    alert("구독자 수 정보 확인 실패")
                }
            })

        let subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom };

        // 구독하려는 사용자의 ID도 필요
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data.success);
                    setSubscribed(response.data.subscribed);
                } else {
                    alert("구독자 수 정보 확인 실패")
                }
            })

    }, [])

    const onSubscribe = () => {

        let subscribeVariables = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        if(Subscribed){ // 이미 구독중
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){
                        console.log(response.data.success);
                        setSubsrcibeNumber(SubsrcibeNumber-1);
                        setSubscribed(!Subscribed);
                    } else{
                        alert("구독 취소 실패");
                    }
                })
        } else{ // 구독 전
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){
                        console.log(response.data.success);
                        setSubsrcibeNumber(SubsrcibeNumber+1);
                        setSubscribed(!Subscribed);
                    } else{
                        alert("구독 실패");
                    }
                })
        }
    } // onSubscribe

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: '#fff', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubsrcibeNumber} {Subscribed ? '구독중' : '구독하기'}
            </button>
        </div>
    )
}

export default Subscribe