export default (mock) => {
    
    mock.onPost("/logs-event-channel/_search").reply(200, JSON.parse('{"took": 3,"timed_out": false,"_shards": {"total": 2,"successful": 2,"skipped": 0,"failed": 0},"hits": {"total": {"value": 17,"relation": "eq"},"max_score": null,"hits": []},"aggregations": {"api_name": {"doc_count_error_upper_bound": 0,"sum_other_doc_count": 0,"buckets": [{"key": "/api/appcard/gcm/ka/GCMKA010101.do","doc_count": 16},{"key": "/web/fin/mn/FINMN010101.do","doc_count": 1}]}}}'));
    mock.onPost("/logs-transaction-channel/_search").reply(200, JSON.parse('{"took":4,"timed_out":false,"_shards":{"total":4,"successful":4,"skipped":2,"failed":0},"hits":{"total": { "value": 2, "relation": "eq" }, "max_score": null, "hits": [ { "_index": ".ds-logs-transaction-channel-2023.09.04-000002", "_id": "SS_5Y4oBajcno0lAdrSe", "_score": null, "_source": { "hc": { "transaction": { "common": { "RANK3_RSPS_USER_ID": "", "SRT_ELTM": "151322", "RSPS_AV_CPNLN_CD": "", "MCI_SESS_ID": "", "PAGE_NO": "001", "USER_ID": "W03" } } } }, "fields": { "event.1category": [ "RCV" ], "hc.csno": [ "1543177085" ], "@timestamp": [ "2023-09-05T06:13:22.772Z" ], "hc.guid.fst": [ "083fcf141627432e9a8b86afbaf58b32" ], "message": [ "0000266200001776121002DTN083fcf141627432e9a8b86afbaf58b32083fcf141627432e9a8b86afbaf58b3200310.211.5.234 172.28.144.237 DTNDCOW03ddchap0102 2023090515132273020230905151322770NC10701001 151322000REN0ko_KRNDW03 002 2 000 1543177085001 BN000001정상적으로 조회 되었습니다 BE100647해당자료가 존재하지 않습니다. 501해당자료가 존재하지 않습니다. ZZ" ], "related.ip": [ "172.28.144.237", "10.211.5.234" ], "hc.guid.now": [ "083fcf141627432e9a8b86afbaf58b32" ] }, "sort": [ 1693894402772 ] }, { "_index": ".ds-logs-transaction-channel-2023.09.04-000002", "_id": "SC_5Y4oBajcno0lAdrSe", "_score": null, "_source": { "hc": { "transaction": { "common": { "RANK3_RSPS_USER_ID": "", "SRT_ELTM": "", "RSPS_AV_CPNLN_CD": "", "MCI_SESS_ID": "", "PAGE_NO": "001", "USER_ID": "W03"} } } }, "fields": { "event.category": [ "SND" ], "hc.csno": [ "1543177085" ], "@timestamp": [ "2023-09-05T06:13:22.722Z" ], "hc.guid.fst": [ "083fcf141627432e9a8b86afbaf58b32" ], "message": [ "0000122300000740121002DTN083fcf141627432e9a8b86afbaf58b32083fcf141627432e9a8b86afbaf58b3200010.211.5.234 172.28.144.237 DTNDCOW03 20230905151300022 NC10701001 000QSN ko_KRNDW03 002 0 1543177085001 154317708501SAMPLE 63ZZ" ], "related.ip": [ "172.28.144.237", "10.211.5.234" ], "hc.guid.now": [ "083fcf141627432e9a8b86afbaf58b32" ] },"sort":[1693894402722]}]}}'));
}
