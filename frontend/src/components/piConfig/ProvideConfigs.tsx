import { FC } from 'react'
import { useProvideConfig, configContext } from '.'
import { useAuth } from '../auth';


const ProvideConfigs: FC = ({ children }) => {
    const auth = useAuth();
    const configs = useProvideConfig(auth)
    return (
        <configContext.Provider value={configs}>
            {children}
        </configContext.Provider>
    );
}


export default ProvideConfigs
