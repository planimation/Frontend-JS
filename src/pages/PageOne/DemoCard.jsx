import React, {useEffect, useRef, useState} from "react";

import Meta from "antd/es/card/Meta";
import {Card, Typography, Image, Modal, Form,Select,Tour,message} from "antd";
import {CloudUploadOutlined} from "@ant-design/icons";
import axios from "axios";


const DemoCard = ({uploadFiles, width=300, title="Hiking", url='', isFirstCard, closeGallery=()=>{}})=>{

  // the description row size
  const [rows, setRows] = useState(2);

  // control the expanded status when description is too long
  const [expanded, setExpanded] = useState(false);
  const [description,setDescription] = useState("This domain don't have the description yet")
  const [coverSrc, setCoverSrc] = useState();

  // all files from Github
  const [files,setFiles] = useState([]);
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const domainRef = useRef(null);
  const problemRef = useRef(null);
  const animationRef = useRef(null);



  const filteredFiles = (keyword)=>{
    return files.filter(item=>item.name.toUpperCase().includes(keyword))
      .map(item=>{
        return {label:item.name, value:item.name}
      })
  }



  const handleUpload = async ()=>{
      try{
          const data = await form.validateFields()

          let file_temp = {}
          file_temp['animation'] = files.find(item=>item.name === data.animation)
          file_temp['domain'] = files.find(item=>item.name === data.domain)
          file_temp['problem'] = files.find(item=>item.name === data.problem)
          uploadFiles(file_temp)

          message.success('Upload successfully!');
        setSelectModalOpen(false)
        closeGallery()

      }catch (_){

      }

  }

  const [form] = Form.useForm()
  useEffect(() => {
    axios.get(url,{
      headers:{
          Authorization: `token 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`
      }
    })
      .then(response => {
        // load files from Github URL
        const files = response.data;
        const filePromises = files.map((file,index) => {
          if (file.type === 'file') {
            if(file.name.toUpperCase().includes(".PNG")){
                setCoverSrc(file.download_url)
            }else{
              return axios.get(file.download_url, { responseType: 'blob',
              })
                .then(fileResponse => {
                  const fileName = file.name;
                  const item = new File([fileResponse.data], fileName,
                    { type: fileResponse.data.type });
                  return {
                    uid:index,
                    name:item.name,
                    status:'done',
                    type:item.type,
                    size:item.size,
                    originFileObj:item,
                    url:file.url
                  }
                });
            }
          }
        });
        return Promise.all(filePromises);
      })
      .then(files => {

        let files_list = files.filter(item =>item)
        let description_files = files_list.filter(item=>item.name==='description.txt')
        if(description_files.length>0){
          const reader = new FileReader();
          reader.onload = (event)=>{
            setDescription(event.target.result)}
          reader.readAsText(description_files[0].originFileObj);
        }
        setFiles(files_list)

      })
  }, []);

  return (
    <>
      <Card
        style={{
          width: width,
        }}
        cover={
          <div style={{display:"flex",justifyContent:'center'}}>
            <Image
              alt="background"
              width={'150'}
              preview={false}
              height={150}
              src={coverSrc?coverSrc:'error'}
              fallback="data:image/png;base64,
              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"

            />
          </div>
        }

        actions={[
          <CloudUploadOutlined key="ellipsis"
                              // {/*{...(isFirstCard ? { ref: buttonRef } : {})}*/}
                               onClick={() => { setSelectModalOpen(true); }} />,
        ]}
      >
        <Meta
          title={title}
          description={<Typography.Paragraph
            ellipsis={{
              rows,
              expandable: 'collapsible',
              expanded,
              onExpand: (_,
                         info) => setExpanded(info.expanded),
            }}
          >
            {description}
          </Typography.Paragraph>}
        />
      </Card>

      <Modal
        title={
        <>
        <Typography.Title level={4} style={{margin:5}} >Select Item
        </Typography.Title>
        </>
      }
        open={selectModalOpen}

        centered
        onOk={handleUpload}
        okText={'Load'}
        onCancel={()=>{
          setSelectModalOpen(false)
        }}
      >
        <Form
          labelCol={{span: 6,}}
          form={form}
          initialValues={
          {
            problem:(filteredFiles("PROBLEM") && filteredFiles("PROBLEM")[0])
              ?filteredFiles("PROBLEM")[0].value
              :null,
            domain:(filteredFiles("DOMAIN") && filteredFiles("DOMAIN")[0])
              ?filteredFiles("DOMAIN")[0].value
              :null,
            animation:(filteredFiles("AP") && filteredFiles("AP")[0])
              ?filteredFiles("AP")[0].value
              :null
          }
          }
          feedbackIcons
        >
          <Form.Item
              label="Domain file" name={'domain'}
              rules={[{required: true, message: "Please select a domain"},]}
          >
            <Select ref={domainRef}
              options={filteredFiles("DOMAIN")}
            />
          </Form.Item>

          <Form.Item label="Problem File" name={'problem'}
                     rules={[{required: true, message: "Please select a problem"}]}
          >
            <Select ref={problemRef}
                    options={filteredFiles("PROBLEM")}

            />
          </Form.Item>

          <Form.Item label="Animation file" name={'animation'}
                     rules={[ {required: true, message: "Please select a animation file"}]}
          >
            <Select ref={animationRef}
                    options={filteredFiles("AP")}

            />
          </Form.Item>
        </Form>
      </Modal>

    </>

  )
}
export  default DemoCard;

