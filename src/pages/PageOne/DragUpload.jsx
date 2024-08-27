import { message, Upload } from 'antd';
import {InboxOutlined, PaperClipOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import css from "../../Styles/index.module.less";
const { Dragger } = Upload;


const DragUpload = ({ name, desc, fileType, onFileLoad,initialFile})=>{
  const [fileList,setFileList] = useState([]);


  useEffect(() => {
    if(initialFile === undefined) return;
    setFileList([{...initialFile}])
    onFileLoad(name, initialFile.originFileObj)

  }, [initialFile]);

  const props = {

    onChange(info) {
      // delete operation
      if(info.fileList.length==0){
        setFileList([])
        onFileLoad(name, undefined);
        return;
      }


      // add or change operation
      if (!info.file.name.endsWith(fileType)) {
        message.error("Wrong type error")
        return;
      }



      onFileLoad(name, info.file);

      info.file.url = URL.createObjectURL(info.file);
      info.file.originFileObj = info.file

      setFileList([info.file])
    },
    beforeUpload(file){return false;},
    onPreview(file){

      const reader = new FileReader();
      reader.onload = (e) => {
        const newWindow = window.open();
        newWindow.document.write('<pre>' + e.target.result + '</pre>');
        newWindow.document.close(); // 确保文档加载完成
      };
      reader.readAsText(file.originFileObj);
    }

  };

  return(
    <div className={css.dropzoneBox}>
      <div>
        <div className={css.fileTitle}>
          <b>{name} File </b>
        </div>
        <div className={css.fileDesc}>{desc}</div>
      </div>
      <Dragger {...props} style={{minWidth:350, minHeight:200}}
               fileList={fileList}
               accept={'.pddl'}
               >
        <p className="ant-upload-drag-icon">
          {fileList.length>0?<PaperClipOutlined />:<InboxOutlined />}
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          {`In this area, You should upload ${name} File`}
        </p>
      </Dragger>
    </div>

  )
}
export default DragUpload;