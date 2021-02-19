import React, { useState, useEffect } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variable = {};

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable) 
            .then(response => {
                if (response.data.success) {
                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.lenght)

                    // 내가 이미 좋아요를 눌렀는지
                    // response.data.likes : 모든 비디오나 코멘트 좋아요에 대한 모든 정보
                    response.data.likes.map(like => {
                        // response.data.likes 데이터 중에 본인의 like.userId가 있을 경우
                        if (like.userId === props.userId) { // props.userId : localStorage에서 가져온 정보
                            setLikeAction('liked');
                        }
                    })
                } else {
                    alert("Likes에 정보를 가져오지 못했습니다.")
                }
            });

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if (response.data.success) {
                    // 얼마나 많은 싫어요를 받았는지
                    setDislikes(response.data.dislikes.lenght)

                    // 내가 이미 싫어요를 눌렀는지
                    // response.data.dislikes : 모든 비디오나 코멘트 싫어요에 대한 모든 정보
                    response.data.dislikes.map(dislike => {
                        // response.data.dislikes 데이터 중에 본인의 dislike.userId가 있을 경우
                        if (dislike.userId === props.userId) { // props.userId : localStorage에서 가져온 정보
                            setDislikeAction('disliked');
                        }
                    })
                } else {
                    alert("Dislikes에 정보를 가져오지 못했습니다.")
                }
            });

    }, [])

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes