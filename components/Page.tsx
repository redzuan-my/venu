export function PageHead({title,sub,action}:{title:string,sub:string,action?:React.ReactNode}){return <div className="pageHead"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
export function Badge({children,tone='success'}:{children:React.ReactNode,tone?:string}){return <span className={'badge '+tone}>{children}</span>}
