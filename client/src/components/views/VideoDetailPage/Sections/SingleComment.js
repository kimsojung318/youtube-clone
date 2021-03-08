import React, { useState } from 'react';
import Axios from 'axios';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false); // 처음에는 숨김 처리
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault(); 

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success){
                    //console.log(response.data.result);

                    setCommentValue("");
                    setOpenReply(false);
                    
                    // VideoDetailPage.js Comments 수정
                    props.refreshFunction(response.data.result);
                } else{
                    alert("댓글 저장 실패");
                }
            })
    } // onSubmit

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            {props.comment.writer && 
                <Comment
                    actions={actions}
                    author={props.comment.writer.name}
                    avatar={<Avatar />} /* src={props.comment.writer.image} alt="image" */
                    content={
                        <p>{props.comment.content}</p>
                    }
                    /* VideoDetailPage.js 값 확인할 것 */
                /> 
            }
            
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="내용을 작성해 주세요."
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>
            }
        </div>
    )
}

export default SingleComment
