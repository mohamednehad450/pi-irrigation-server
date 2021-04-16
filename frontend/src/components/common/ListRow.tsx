import { FC, ReactNode, useEffect, useRef, useState, } from 'react'

interface ListRowProps {
    expanded?: boolean
    expandable?: boolean
    onClick?: () => void
    leftItem?: ReactNode
    rightItem?: ReactNode
    expandedItem?: ReactNode
    expandedClassName?: string
}


const ListRow: FC<ListRowProps> = ({
    onClick,
    expanded = false,
    expandedItem = null,
    expandedClassName = '',
    leftItem = null,
    rightItem = null,
}) => {
    const [height, setHeight] = useState('auto')

    const rowRef: any = useRef(null);
    const expRef: any = useRef(null);

    // Calculate height on Expanded change
    useEffect(() => setHeight(rowRef.current.offsetHeight + 1 + (expanded ? expRef.current.offsetHeight : 0))
        , [expanded])

    // Used to unmount expandedItem after animation ends 
    const [exp, setExp] = useState(expanded)
    useEffect(() => { expanded ? setExp(true) : setTimeout(() => { setExp(false) }, 300) }, [expanded])

    return (
        <div style={{ height }} className={`row-container ${(expanded && expandedItem) ? 'gray-bg' : ''}`}>
            <div ref={rowRef} onClick={() => onClick && onClick()} className="row">
                <div className="row-section">
                    {leftItem}
                </div>
                <div className="row-section">
                    {rightItem}
                </div>
            </div>
            {expandedItem && (
                <div ref={expRef} className={`expandable-container ${expanded ? `${expandedClassName}` : ''}`}>
                    {(expanded || exp) ? expandedItem : null}
                </div>
            )}
            <hr></hr>
        </div>
    )
}


export default ListRow