import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;

function Comment(props) {

    const videoId = props.postId;
    const user = useSelector(state => state.user);

    const [commentValue, setcommentValue] = useState("");

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value);
    }// handClick

    const onSubmit = (event) => {
        // 내용이 없을 경우 버튼 클릭 시 새로고침되는 현상을 막아준다.
        event.preventDefault();

        // writer: redux를 사용하여 가져오기
        // postId : VideoDetailPage.js에서 props or URL에서 가져온다.

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId
        };

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data.result);
                    setcommentValue("");
                    // VideoDetailPage.js Comments 수정
                    props.refreshFunction(response.data.result);
                } else {
                    alert("댓글 저장 실패");
                }
            })
    }// onSubmit

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists {console.log(props.CommentLists)} */}
            
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo && // 상위 댓글과 구분하여 화면에 노출
                    <React.Fragment key={comment._id}>
                        <SingleComment
                            comment={comment}
                            postId={videoId}
                            refreshFunction={props.refreshFunction} />
                        <ReplyComment 
                            parentCommentId={comment._id} 
                            postId={videoId} 
                            CommentLists={props.CommentLists} 
                            refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="내용을 작성해 주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>

    )
}

export default Comment