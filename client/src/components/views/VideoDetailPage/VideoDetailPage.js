import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {

    // App.js에서 path="/video/:videoId" 지정했기 때문에 불러올 수 있음
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([]);
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.VideoDetail);
                } else {
                    alert("비디오 정보 가져오기 실패")
                }
            })

        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if (response.data.success) {
                setComments(response.data.comments);
                //console.log(response.data.comments);
            } else {
                alert("댓글 정보 가져오기 실패")
            }
        })
    }, [])

    const refreshFunction = (newComment) => {
        // concat : 기존의 배열을 수정하지 않고, 새로운 원소가 추가된 새로운 배열을 생성
        setComments(Comments.concat(newComment));
    }

    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar />} /* src={VideoDetail.writer.image} */
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />

                        </List.Item>

                        {/* Comments */}
                        <Comment CommentLists={Comments} postId={videoId} refreshFunction={refreshFunction} />

                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else{
        return (
            <div>
                ...Loading
            </div>
        )
    }
} // VideoDetailPage

export default VideoDetailPage