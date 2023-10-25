import http from "./http";

const searchXmpLogInfo = async (serviceName, gteDttm, lteDttm, xmpID, ipAddress, csno) => {
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
                                "hc.service.name": [serviceName]
                            }
                        }
                    ]
                }
        };

        if (xmpID) {
            queryObj.bool.filter.push({
                terms: {
                    "hc.transaction.common.TRX_CD": [xmpID]
                }
            });
        }
        if (ipAddress) {
            queryObj.bool.filter.push({
                terms: {
                    "hc.transaction.common.TRM_IPAD": [ipAddress]
                }
            });
        }
        if (csno) {
            queryObj.bool.filter.push({
                terms: {
                    "hc.csno": [csno]
                }
            });
        }

        const response = await http.post('/logs-transaction-channel/_search', {
            size: 10000,
            _source: false,
            fields: [
                "@timestamp",
                "hc.guid.fst",
                "hc.guid.now",
                "hc.transaction.common.TRM_IPAD",
                "hc.csno",
                "hc.event.category",
                "hc.transaction.common.TRX_CD",
                "message"
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
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
}

export {
    searchXmpLogInfo
}
