import http from "./http";

const searchEventLogInfo = async (serverList, gteDttm, lteDttm, csno, ip, api) => {
    try {

        const queryObj = {
            bool: {
                    filter: [
                        {
                            range: {
                                "@timestamp": {
                                    "gte": gteDttm,
                                    "lte": lteDttm
                                }
                            }
                        },
                        {
                            terms: {
                                "hc.service.name": serverList
                            }
                        }
                    ], must : [
                        {
                            wildcard : {
                                "hc.api.name" : {
                                    "value" : api
                                }
                            }
                        }
                    ]
                }
        };

        if (csno) {
            queryObj.bool.filter.push({
                terms: {
                    "hc.csno": [csno]
                }
            });
        }
        if (ip) {
            queryObj.bool.filter.push({
                terms: {
                    "source.ip": [ip]
                }
            });
        }

        const response = await http.post('/logs-event-channel/_search', {
            size: 10000,
            _source: [
                "@timestamp",
                "hc.api.duration",
                "agent.name",
                "hc.os.platform",
                "hc.os.version",
                "hc.csno",
                "hc.service.name",
                "hc.api.name",
                "source.ip",
                "hc.event.res.parsed.hdr.srvrDt" ,
                "hc.event.res.parsed.hdr.srvrEltm" ,
                "hc.event.req.message",
                "hc.event.res.message",
                "hc.event.res.parsed.hdr.rsltCd" 
            ],
            fields: [
                "@timestamp",
                "hc.api.duration",
                "agent.name",
                "hc.os.platform",
                "hc.os.version",
                "hc.csno",
                "hc.service.name",
                "hc.api.name",
                "source.ip",
                "hc.event.res.parsed.hdr.srvrDt" ,
                "hc.event.res.parsed.hdr.srvrEltm" ,
                "hc.event.req.message",
                "hc.event.res.message",
                "hc.event.res.parsed.hdr.rsltCd" 
            ],
            sort: [
                {
                    "@timestamp": {
                        "order": "asc"
                    }
                }
            ],
            query: queryObj
        });
        
        return response.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

function postEventLog(url, data) {
    return axios.post('https://reqres.in/api/users?page=1', data);
}

function getEventLog(url) {
    return axios.get('https://reqres.in/api/users?page=1');
}

export {
    searchEventLogInfo , postEventLog, getEventLog
}
