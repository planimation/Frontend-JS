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
    this.state = {url:'https://solver.planning.domains:5001/package/dual-bfws-ffparser/solve',
      fineUrl:'',
      alertURL:false,
      alertMessage: ''};
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSendURL = this.handleSendURL.bind(this);
  }

  handleOnClick = () => {
    this.props.history.push('/')
  }

  handleStore = (content)=> {
    localStorage.setItem('fileContent', content);
    window.location.href = '/demo';
  }

  handleNewURL = (urlString) => {
    const url = {...this.state};
    url['url'] = urlString;
    this.setState(url);
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
          <div style={{float: 'left', marginLeft: '1%', alignItems: 'center'}}>
            <Button onClick={this.handleSendURL} variant="contained" color="primary" size="medium">
              Paste
            </Button>
          </div>
        </form>
        <div>
          <h3 className={css.text}>
            Step 2 - Upload Problem, Domain and Animation Profile Files
          </h3>
        </div>
        <DropAndFetch onClick={this.handleOnClick} onStore={this.handleStore} newURL={this.state.url}/>
        <Alert open={this.state.alertURL} reset={this.handleResetAlert} severity="warning">
          {this.state.alertMessage}
        </Alert>
      </div>
    );
  }

}

export default PageOne;