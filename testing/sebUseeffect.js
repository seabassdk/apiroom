useEffect(() => {
    if (props.execute) {
        const zenResult = [];
        const zenErrors = []
        const startTime = new Date();

        //save the result
        const printzenroom = (text) => { 
            zenResult.push(text) 
        }

        //Save any error
        const print_err_fn = (text) => { 
            zenErrors.push(text) 
        }

        //zenroom returns successfully
        const onSuccess = () => {
            // const logs = zenErrors.length ? zenErrors : [];
            // props.onLogsChanged(logs);

            // const param = zenResult.length ? zenResult : []
            // props.onResultChanged(param);

            props.onLogsChanged(zenErrors);
            props.onResultChanged(zenResult);

            const timeTaken = (new Date()) - startTime;
            setExecutionTime(timeTaken);
        }

        //zenroom returns with error
        const onError = () => {
            props.onResultChanged([{ error: 'Error detected. Execution aborted.' }]);
            props.onLogsChanged(zenErrors);
        }

        // const options = {
        //     script: props.zencode,
        //     data: props.data,
        //     conf: null,
        //     keys: props.keys ? JSON.parse(props.keys) : null,
        //     print: printzenroom,
        //     print_err: print_err_fn,
        //     success: onSuccess,
        //     error: onError
        // };

        const options = {
            script: props.zencode,
            data: props.data,
            conf: props.config,
            keys: props.keys ? JSON.parse(props.keys) : null,
            print: print,
            print_err: print_err,
            success: onSuccess,
            error: onError,
          };

        //execute zenroom
        zenroom.init(options).zencode_exec();

        // set executing false
        props.onExecute(false);

    }


}, [props]);