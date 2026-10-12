import {useEffect, useState} from "react";
import axios from "axios";
import {Empty, Flex} from "antd";
import DemoCard from "./DemoCard";



const DemoCards = ({uploadFiles,closeGallery=()=>{}})=>{
   const [cardsInfo,setCardsInfo] = useState();

   useEffect(() => {
     // get the whole repository tree from Github in a single unauthenticated request
     // (the repository is public; never put a token in front-end code, it ships in the bundle)
     const owner = 'planimation';
     const repo = 'documentation';
     const path = 'AnimationProfiles';
     const branch = 'master';
     const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
     const rawUrl = (filePath) => `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`
        + filePath.split('/').map(encodeURIComponent).join('/');
      axios.get(githubApiUrl)
        .then(response => {
           // group the files directly inside each AnimationProfiles/<folder>
           const folders = {};
           response.data.tree.forEach(item=>{
              const parts = item.path.split('/');
              if(parts[0] !== path) return;
              if(item.type === 'tree' && parts.length === 2){
                 folders[parts[1]] = folders[parts[1]] || [];
              }else if(item.type === 'blob' && parts.length === 3){
                 folders[parts[1]] = folders[parts[1]] || [];
                 folders[parts[1]].push({
                    type: 'file',
                    name: parts[2],
                    download_url: rawUrl(item.path),
                    url: rawUrl(item.path)
                 })
              }
           })
           setCardsInfo(Object.keys(folders).map(name=>({name: name, files: folders[name]})))
        })

   }, []);

   return(
     <>
        {
           (!cardsInfo || cardsInfo.length == 0)
          ?  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          :<Flex justify={'center'} wrap={"wrap"} align={'center'} gap={40}>
                {
                   cardsInfo.map((item,index)=>{
                      return <DemoCard title={item.name} entries={item.files}isFirstCard={index === 0}
                                       closeGallery={closeGallery}
                                       uploadFiles={uploadFiles}/>
                   })
                }
          </Flex>
        }

     </>
   )
}
export default DemoCards;
