export default (mock) => {
    mock.onPost("/logs-event-channel/_search").reply(200, JSON.parse('{"took": 3,"timed_out": false,"_shards": {"total": 2,"successful": 2,"skipped": 0,"failed": 0},"hits": {"total": {"value": 17,"relation": "eq"},"max_score": null,"hits": []},"aggregations": {"api_name": {"doc_count_error_upper_bound": 0,"sum_other_doc_count": 0,"buckets": [{"key": "/api/appcard/gcm/ka/GCMKA010101.do","doc_count": 16},{"key": "/web/fin/mn/FINMN010101.do","doc_count": 1}]}}}'));
}
