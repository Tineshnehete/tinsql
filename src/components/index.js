import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js";

import TerminalSql from "./terminal";
// Required to let webpack 4 know it needs to copy the wasm file to our assets

export default function App() {
    const [db, setDb] = useState(null);
    const [error, setError] = useState(null);


    const fakeRequest = () => {
        return new Promise(resolve => setTimeout(() => resolve(), 5000));
    };

    useState(() => {
        fakeRequest().then(() => {
            try {
                // document.getElementById("main-loader").remove()
            }
            catch {

            }

        })
    })






    useEffect(() => {
        async function c() {
            // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
            // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
            // see ../craco.config.js
            try {
                
                const SQL = await initSqlJs({
                    // Required to load the wasm file in the browser
                    locateFile: (file) => {
                        return `/sql/${file}`;
                    },
                 });
                setDb(new SQL.Database());
            } catch (err) {
                setError(err);
            }
        }

        c()
    }, []);

    if (error) return <pre>{error.toString()}</pre>;
    else if (!db) return <pre>Loading...</pre>;
    else return <SQLRepl db={db} />;
}

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
function SQLRepl({ db }) {
    console.log(db)

    function exec(sql) {
        try {
            // The sql is executed synchronously on the UI thread.
            // You may want to use a web worker here instead

            return {
                err:  "",
                res: db.exec(sql)

            }
        } catch (err) {
            // exec throws an error when the SQL statement is invalid
            return {
                err: err,
                res: []

            }
        }
    }


    return (
        <>
            <TerminalSql
                func={exec}
                res={ResultsTable}
            />
        </>
    )
    /***
      return (
        <div className="App">
          <h1>React SQL interpreter</h1>
    
          <textarea
            onChange={(e) => exec(e.target.value)}
            placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
          ></textarea>
    
          <pre className="error">{(error || "").toString()}</pre>
    
          <pre>
            {
              // results contains one object per select statement in the query
              results.map(({ columns, values }, i) => (
                <ResultsTable key={i} columns={columns} values={values} />
              ))
            }
          </pre>
        </div>
      );***/
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((columnName, i) => (
                        <td key={i}>{columnName}</td>
                    ))}
                </tr>
            </thead>

            <tbody>
                {
                    // values is an array of arrays representing the results of the query
                    values.map((row, i) => (
                        <tr key={i}>
                            {row.map((value, i) => (
                                <td key={i}>{value}</td>
                            ))}
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
