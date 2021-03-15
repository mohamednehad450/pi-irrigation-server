import { FC } from 'react'
import { useProvideAuth, authContext } from '.'


const ProvideAuth: FC = ({ children }) => {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}


export default ProvideAuth
