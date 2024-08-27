import React from "react";
import DropAndFetch from "./dropAndFetch";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '../../components/alertInFormat';
import css from '../../Styles/index.module.less';
import {InputLabel} from "@material-ui/core";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {FloatButton, Modal, Tour} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import DemoCards from "./DemoCards.jsx";

const options = [
  {
    value: 'https://solver.planning.domains:5001/package/dual-bfws-ffparser/solve',
    label: 'BFWS--FF-parser version'
  },
  // {
  //   value: 'https://solver.planning.domains:5001/package/delfi/solve',
  //   label: 'Delfi:online planner selection for cost-optimal planning'
  // },
  // {
  //   value: 'https://solver.planning.domains:5001/package/enhsp-2020/solve',
  //   label: 'ENHSP -- 2020 version'
  // },
  {
    value: 'https://solver.planning.domains:5001/package/lama-first/solve',
    label: 'LAMA-first: satisficing planner without solution improvement'
  },
  // {
  //   value: 'https://solver.planning.domains:5001/package/optic/solve',
  //   label: 'OPTIC: Optimising Preferences and Time-Dependent Cost'
  // },
  // {
  //   value: 'https://solver.planning.domains:5001/package/tfd/solve',
  //   label: 'Temporal Fast Downward planning system'
  // }
]
class PageOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:'https://solver.planning.domains:5001/package/dual-bfws-ffparser/solve',
      fineUrl:'',
      alertURL:false,
      loaderModelOpen:false,
      externalFiles:{},
      tourOpen:localStorage.getItem("used") !== "yes",
      alertMessage: ''};
    this.floatBtnRef = React.createRef();

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSendURL = this.handleSendURL.bind(this);
    this.handleSetExternalFiles = this.handleSetExternalFiles.bind(this);

  }
  handleSetExternalFiles = (files)=>{
    this.setState({externalFiles:files})
  }
  handleOnClick = () => {
    this.props.history.push('/')
  }


  handleStore = (content)=> {
    localStorage.setItem('fileContent', content);

    window.location.href = '/demo';
  }

  handleNewURL = (urlString) => {
    this.setState({url:urlString});
  }


  handleSendURL = () => {
    const state = {...this.state};
    const url = state.url;
    const pattern = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;

    if (!!pattern.test(url)){
      state['fineUrl'] = url;
      this.setState(state);
    } else {
      this.handleAlert('The URL is not valid');
    }
  }

  handleAlert = (message) => {
    const state = {...this.state};
    state.alertURL = true;
    state.alertMessage = message;
    this.setState(state);
  }

  handleResetAlert = () => {
    const state = {...this.state};
    state.alertURL = false;
    this.setState(state)
  }

  render() {
    const steps = [
      {
        title: 'Quick Samples',
        description: 'Load a sample from github',
        cover: (
          <img
            alt="tour.png"
            src="https://achieva-agent-public.oss-ap-southeast-1.aliyuncs.com/cover.png"
          />
        ),
        target: () => this.floatBtnRef.current,
      },
    ];
    const useStyles = makeStyles((theme) => ({
      root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
    }));

    return (
      <div className={css.container}>
        <div className={css.header}>
          <h3 className={css.subtitle}>Build Visualisation From Problem</h3>
        </div>
        <div>
          <h3 className={css.text}>
            Step 1 - Select planner URL
          </h3>
        </div>
        <form className={useStyles.root} noValidate autoComplete="off">
          <div className={css.text}>
            <Select
              value={this.state.url}
              id="outlined-basic"
              labelId="outlined-basic"
              size='small'
              label="Solver"
              onChange={ e => this.handleNewURL(e.target.value)}
              style={{float: 'left', width: '90%', marginLeft: '10%'}}
            >

              {options.map(
                (item,index)=>
                  <MenuItem value={item.value} key={index}>{item.label}</MenuItem>)
              }
            </Select>
          </div>

        </form>

        <div>
          <h3 className={css.text} >
            Step 2 - Upload Problem, Domain and Animation Profile Files
          </h3>
        </div>

        <DropAndFetch
          onClick={this.handleOnClick}
          onStore={this.handleStore}
          newURL={this.state.url}
          externalFiles = {this.state.externalFiles}
        />
        <Alert open={this.state.alertURL} reset={this.handleResetAlert} severity="warning">
          {this.state.alertMessage}
        </Alert>

        <Modal
          title="Animation Gallery"

          open={this.state.loaderModelOpen}
          width={'70vw'}
          styles={{
            body: { height:'60vh' ,overflow:'auto'}
          }}
          onOk={()=>{
            this.setState({ loaderModelOpen: false})
          }}
          onCancel={()=>{
            this.setState({ loaderModelOpen: false})
          }}
        >

          <DemoCards uploadFiles={this.handleSetExternalFiles}
                     closeGallery={()=>{   this.setState({ loaderModelOpen: false})}}
          />

        </Modal>

        <FloatButton
          tooltip={'Load Quick Demo'}
          type="primary"
          ref={this.floatBtnRef}
          style={{
            right: 50,
          }}
          icon={<UploadOutlined/>}
          onClick={()=>{
            this.setState({ loaderModelOpen: true})
          }} />
        <Tour open={this.state.tourOpen} onClose={() => {
          localStorage.setItem("used","yes");
          this.setState({tourOpen: false})
        }} steps={steps} />
      </div>
    );
  }

}

export default PageOne;