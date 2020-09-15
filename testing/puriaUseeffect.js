useEffect(() => {
    if (props.execute) {
      const zenResult = [];
      const zenErrors = [];
      const startTime = new Date();

      //save the result
      const print = (text) => {
        zenResult.push(text);
      };

      //Save any error
      const print_err = (text) => {
        zenErrors.push(text);
      };

      //zenroom returns successfully
      const onSuccess = () => {
        props.onLogsChanged(zenErrors);
        props.onResultChanged(zenResult);

        const timeTaken = new Date() - startTime;
        setExecutionTime(timeTaken);
      };

      //zenroom returns with error
      const onError = () => {
        props.onResultChanged([
          { error: "Error detected. Execution aborted." },
        ]);
        props.onLogsChanged(zenErrors);
      };

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
}