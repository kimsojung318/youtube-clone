import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
//import Icon from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";
import { withRouter } from 'react-router-dom'; // history 사용을 위해 추가

function VideoUploadPage(props) {

    const user = useSelector(state => state.user); // user 모든 정보가 담긴다.
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setprivacy] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const Private = [
        { value: 0, label: "Private" },
        { value: 1, label: "Public" }
    ]

    const CategoryOptions = [
        { value: 0, label: "Film & Animation" },
        { value: 1, label: "Autos & Vehicles" },
        { value: 2, label: "Music" },
        { value: 3, label: "Pets & Animals" },
        { value: 4, label: "Sports" },
    ]

    const onTitleChange = (e) => {
        // console.log(e)
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onCategoryOptionsChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        axios.post('http://localhost:5000/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    // console.log(response.data);

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    axios.post('http://localhost:5000/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                //console.log(response.data.url);
                                //console.log(response.data.fileDuration);

                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                            } else {
                                alert('썸네일 생성 실패');
                            }
                        })
                } else {
                    alert("비디오 업로드 실패");
                }
            })
    } // onDrop

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id, // redux 사용
            title: VideoTitle,
            description: Description,
            privacy: privacy,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data)
                    message.success("비디오 업로드 성공");
                    setTimeout(() => {
                        props.history.push('/');
                    },3000);
                } else {
                    alert('비디오 업로드 실패')
                }
            })
    } // onSubmit

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {/*<Title level={2}> Upload Video</Title>*/}
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>

                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px',
                                border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}
                                {...getRootProps()}>

                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {ThumbnailPath !== "" && // ThumbnailPath가 있을 경우만 노출
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <select onChange={onCategoryOptionsChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
		        </Button>
            </Form>
        </div>
    )
}

export default withRouter(VideoUploadPage)