import React, { useEffect, useState } from 'react'
// import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
// import axios from 'axios';
// import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />

            <Row gutter={[32, 16]}>
                <Col lg={6} md={8} xs={24}>
                    <div style={{ position: 'relative' }}>
                        {/* <a href={`/video/${video._id}`} > */}
                            <div className=" duration">
                                {/* <span>{minutes} : {seconds}</span> */}
                            </div>
                        {/* </a> */}
                    </div>
                    <br />
                    <Meta
                        /*avatar={
                            <Avatar src={video.writer.image} />
                        }
                        title={video.title}*/
                        description=""
                    />
                    {/* <span>{video.writer.name} </span><br />
                    <span style={{ marginLeft: '3rem' }}> {video.views}</span>
                    - 
                    <span> {moment(video.createdAt).format("MMM Do YY")} </span> */}
                </Col>
            </Row>
        </div>
    )
}

export default LandingPage
