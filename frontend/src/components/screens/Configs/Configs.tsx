import { FC, useState } from "react"
import { Button, Header, ListRow } from "../../common"
import { useConfig } from "../../piConfig"
import { Link } from "react-router-dom"
import { routes } from "../../../routes"
import ConfigDetails from "./ConfigDetails"

import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { ReactComponent as PlayIcon } from '../../../assets/icons/play.svg'



const Configs: FC = () => {

    const { configs, deleteConfig, runConfig } = useConfig()
    const [expandedId, setExpandedId] = useState('')

    return (
        <div className="container">
            <Header
                title={'Configs'}
            />
            <div className="list-container">
                {configs.map(c => (
                    <ListRow
                        onClick={() => c.id === expandedId ? setExpandedId('') : setExpandedId(c.id)}
                        expanded={c.id === expandedId}
                        expandable
                        expandedItem={<ConfigDetails config={c.config_json} />}
                        leftItem={(
                            <>
                                <span className="text-title">
                                    {c.config_json.name}
                                </span>
                            </>
                        )}
                        rightItem={(
                            <>
                                <Button
                                    className="btn-icon padding"
                                    onClick={(e) => { e.stopPropagation(); window.confirm('Run config?') && runConfig(c.id) }}
                                >
                                    <span className="icon">
                                        <PlayIcon />
                                    </span>
                                </Button>
                                <Link
                                    className="btn-icon padding"
                                    to={`${routes.NEW_CONFIG}?edit=${c.id}`}
                                >
                                    <span className="icon">
                                        <EditIcon />
                                    </span>
                                </Link>
                                <Button
                                    className="btn-icon padding"
                                    onClick={(e) => { e.stopPropagation(); window.confirm('Delete Zone?') && deleteConfig(c.id) }}
                                >
                                    <span className="icon">
                                        <DeleteIcon />
                                    </span>
                                </Button>
                            </>
                        )}
                    />
                ))}
            </div>
        </div>
    )
}



export default Configs