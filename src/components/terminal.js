// import logo from './logo.svg';
// import './App.css';
import React, { Component, useState } from 'react';
// import Terminal from  'terminal-in-react';
import stringTable from 'string-table'
// import { ReactTerminal } from "react-terminal";
import Terminal, { TerminalOutput } from 'react-terminal-ui';
const defaultTerminalData = [
  'Welcome to tin-sql',
  'Its a simple browser based SQL interpreter',
  'sqlite - v3.45.2',
  'Starting input value : select sqlite_version();'

]
function TerminalSql(props) {
  const [command, setCommand] = useState("");
  const [commandSts, setCommandSts] = useState("complete");
  const [terminalLineData, setTerminalLineData] = useState([
    ...defaultTerminalData
  ]);

  var detect_end = (cmd) => {
    let s = cmd.toString().replace(' ', '');
    let lastlettr = s.at(-1);

    if (lastlettr === ";") {
      return true;
    }
    if (s === "") {
      return true;
    }
    return false;
  };

  const exec = (cmd) => {
    console.log(cmd , command);

    if (detect_end(cmd)) {
      setCommandSts("complete");

      let current_command = `${command}`;
      // for (let a in cmd) {
        console.log(`${cmd}`);
        current_command = `${current_command} ${cmd}`;
        setCommand("");
      // }

      // setCommand("");
      let o = props.func(current_command);
      console.log(o);
      if (!o.err) {
        let out_res = [];
        let k = "";
        let v = "";
        console.log(o.res);
        for (let a in o.res) {
          for (let row in o.res[a].values) {
            out_res[row] = [];
            for (let data in o.res[a].values[row]) {
              out_res[row][o.res[a].columns[data]] = o.res[a].values[row][data];
            }
          }
        }
        console.log(out_res, "ll");
        return stringTable.create(out_res);
      } else {
        console.log(o.err);
        return "   " + o.err.toString();
      }
    } else {
      let tmp_cmd = "";
      // for (let a in cmd) {
        tmp_cmd = `${tmp_cmd} ${cmd}`;
      // }
      setCommand(`${command} ${tmp_cmd}`);
      setCommandSts("incomplete");
    }
  };

  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      }}
    >
      {/* <ReactTerminal
        commands={commands}
        width={"100%"}
        welcomeMessage={"Welcome to tin-sql"}
        prompt={"tin-sql >> "}
        themes={{
          default: {
            themeBGColor: "#272B36",
            themeToolbarColor: "#DBDBDB",
            themeColor: "#FFFEFC",
            themePromptColor: "#a917a8"
          }
        }}
        defaultHandler={(cmd) =>{ console.log(cmd); return "Command not found"}}
        // defaultHandler={exec}
      /> */}

      <Terminal 
        prompt='tinsql >>> '
        name='TinSql - A simple browser based SQL interpreter . ( sqlite - v3.45.2 )'
        
        onInput={(input) =>{console.log(input); const res = exec(input) ;setTerminalLineData([...terminalLineData, `\n tinsql >>> ${input}\n${res ?? ""}\n`])}}
        startingInputValue='select sqlite_version();'
        colorMode={true}
      >
        {
          terminalLineData.map((line, index) => (
            <TerminalOutput key={index} >{line}</TerminalOutput>
          ))
        }

      </Terminal>
    </div>
  );
}

export default TerminalSql;
