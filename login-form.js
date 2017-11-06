import React from 'react';

const LoginForm = ( store ) => {

    const username = store.storeusername;
    const password = store.dbpasswd;

    return <form style={{display:'inline'}} key="form" method="post" action={'http://' + store.url + '/freshadmin/user/login/'} target="_blank">
        <input type="hidden" name="username" value={username} />
        <input type="hidden" name="password" value={password} />
        <input style={{display:'inline', marginRight:'15px'}} className="btn green" type="submit" value="Login" />
    </form>
};

export default LoginForm;