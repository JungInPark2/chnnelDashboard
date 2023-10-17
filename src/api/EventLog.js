import http from "./http";

const searchEventLogInfo = async (serviceName, instances, gteDttm, lteDttm, csno, ip, api) => {
    try {
        const response = await http.post('/logs-event-channel/_search', {
            size: 10000,
            _source: [
                "@timestamp",
                "hc.api.duration",
                "agent.name",
                "hc.os.platform",
                "hc.os.version",
                "hc.csno",
                "hc.api.name",
                "source.ip",
                "hc.event.res.parsed.hdr.srvrDt" ,
                "hc.event.res.parsed.hdr.srvrEltm" ,
                "hc.event.req.message",
                "hc.event.res.message"  
            ],
            fields: [
                "@timestamp",
                "hc.api.duration",
                "agent.name",
                "hc.os.platform",
                "hc.os.version",
                "hc.csno",
                "hc.api.name",
                "source.ip",
                "hc.event.res.parsed.hdr.srvrDt" ,
                "hc.event.res.parsed.hdr.srvrEltm" ,
                "hc.event.req.message",
                "hc.event.res.message"  
            ],
            sort: [
                {
                    "@timestamp": {
                        "order": "asc"
                    }
                }
            ],
            query: {
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
                                "hc.service.name": serviceName
                            }
                        },
                        {
                            terms: {
                                "agent.name": instances
                            }
                        },
                        {
                            terms: {
                                "hc.api.name": [api]
                            }
                        },
                        {
                            terms: {
                                "hc.csno": [csno]
                            }
                        },
                        {
                            terms: {
                                "source.ip": [ip]
                            }
                        }
                    ]
                }
            }
        });
        
        return response.data;
    } catch (error) {
        // 타임아웃 에러 처리
        if (error.code === 'ECONNABORTED') {
            console.error('API 타임아웃');
            throw new Error('API 타임아웃');
        } else {
            console.error('API 요청 중 오류 발생:', error);
            throw error;
        }
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
