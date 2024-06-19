import React, {useEffect, useState} from "react";
import DropZone from "./dropZone";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import css from "../../Styles/index.module.less";
import Alert from "../../components/alertInFormat";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import DragUpload from "./DragUpload";

/**
 * Three DropZones and Upload button to fetch pddl to server
 * @param {function} props onStore function to send file to pageFour
 * @param {function} props onClick function to go back to home
 * @param {string} props url argument to pass to backend
 * @returns
 */
export default function DropAndFetch({ onStore, onClick, newURL,externalFiles={}}) {
  const [dataFiles, setDataFiles] = useState();
  const [showAlert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // for render purpose
  const [time, setTimes] = useState(0);

  useEffect(() => {
    setDataFiles({...externalFiles,url:newURL})
    setTimes(time+1)
  }, [externalFiles,newURL]);


  const dragsAndDrops = [
    {
      name: "Domain",
      fileType: ".pddl",
      desc: "for predictes and actions",
      initialFile:externalFiles['domain']
    },
    {
      name: "Problem",
      fileType: ".pddl",
      desc: "for objects, initial state and goal",
      initialFile:externalFiles['problem']
    },
    {
      name: "Animation",
      fileType: ".pddl",
      desc: "object representations",
      initialFile:externalFiles['animation']
    },
  ];

  const uploadPDDL = async (files) => {
    const formData = new FormData();

    for (const name in files) {
      formData.append(name, files[name]);
    }


    try {
      setLoading(true);
      const resp = await fetch(
        "https://planimation.planning.domains/upload/pddl",
        // "http://47.236.182.248:8000/upload/pddl",
        {
          // "http://127.0.0.1:8000/upload/pddl" On local server
          method: "POST", //DO NOT use headers
          body: formData, // Dataformat
        }
      );
      const data = await resp.json();
      if(data.status==='error'){
        throw new Error(data.message)
      }

      const txt = JSON.stringify(data);
      onStore(txt);
    } catch (error) {
      setAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAlert = () => {
    setAlert("");
  };

  const handleSubmit = () => {
    //Control check for files

    if (
      "domain" in dataFiles &&
      "problem" in dataFiles &&
      "animation" in dataFiles &&
      "url" in dataFiles
    ) {
      uploadPDDL(dataFiles);
    } else {
      setAlert("Some files are missing");
    }
  };

  const handleFileLoad = async (name, file) => {
    // if file is deleted
    if (!file){
      setDataFiles(current=>{
        let temp = {};
        for(let field in current){
          if(name.toLowerCase() !== field.toLowerCase()){
            temp[field] = current[field]
          }
        }

        return temp
      })
      return;
    }


    await file.text().then((result) => {
      file = result
    });

    setDataFiles(current=>{return{
      ...current,
      [name.toLowerCase()]: file
    }})

  };

  return (
    <React.Fragment>
      <div className={css.dropareaBox}>
        <div style={{display:"flex",justifyContent:"center" ,alignItems:'center'}}>
          {dragsAndDrops.map((drag) => (
            <DragUpload
              key={drag.name + time}
              name={drag.name}
              desc={drag.desc}
              initialFile={drag.initialFile}
              fileType={drag.fileType}
              onFileLoad={handleFileLoad}
            />
          ))}
          {loading && <div className={css.loadingBox} />}
        </div>
        <div>
          <div className={css.buttonBox}>
            <Button
              variant="contained"
              color="default"
              onClick={() => onClick()}
            >
              Cancel
            </Button>
            <div className={css.wrapper}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={handleSubmit}
                disabled={loading}
              >
                Upload Files
              </Button>
              {loading && (
                <CircularProgress size={24} className={css.loading} />
              )}
            </div>
          </div>
        </div>
        <Alert
          open={showAlert.length > 1 ? true : false}
          reset={handleResetAlert}
          severity="error"
        >
          {showAlert}
        </Alert>
      </div>
    </React.Fragment>
  );
}
