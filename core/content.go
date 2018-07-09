package core

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	common_def "muidea.com/magicCommon/common"
	common_result "muidea.com/magicCommon/common"
	"muidea.com/magicCommon/foundation/net"
	"muidea.com/magicCommon/model"
)

func (s *Share) uploadAction(res http.ResponseWriter, req *http.Request) {
	log.Print("uploadAction")

	type catalogParam struct {
		Name        string          `json:"name"`
		Description string          `json:"description"`
		Catalog     []model.Catalog `json:"catalog"`
	}

	type catalogResult struct {
		common_result.Result
		Catalog model.SummaryView `json:"catalog"`
	}

	param := &catalogParam{}
	result := catalogResult{}
	for {
		authToken := req.URL.Query().Get(common_def.AuthTokenID)
		sessionID := req.URL.Query().Get(common_def.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("uploadAction, create catalog failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}

		err := net.ParsePostJSON(req, param)
		if err != nil {
			log.Printf("uploadAction, ParsePostJSON failed, err:%s", err.Error())
			result.ErrorCode = common_result.Failed
			result.Reason = "非法请求"
			break
		}

		catalog, ok := s.centerAgent.CreateCatalog(param.Name, param.Description, param.Catalog, authToken, sessionID)
		if !ok {
			log.Print("uploadAction, create catalog failed")
			result.ErrorCode = common_result.Failed
			result.Reason = "新建分类失败"
			break
		}

		result.ErrorCode = common_result.Success
		result.Catalog = catalog
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) viewAction(res http.ResponseWriter, req *http.Request) {
	log.Print("viewAction")

	type catalogResult struct {
		common_result.Result
		Content model.CatalogDetailView `json:"content"`
	}

	result := catalogResult{}
	for {
		authToken := req.URL.Query().Get(common_def.AuthTokenID)
		sessionID := req.URL.Query().Get(common_def.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("viewAction, query catalog failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}
		_, value := net.SplitRESTAPI(req.URL.Path)
		id, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("viewAction, query catalog failed, illegal id, id:%s, err:%s", value, err.Error())
			result.ErrorCode = common_result.Failed
			result.Reason = "非法参数"
			break
		}

		catalog, ok := s.centerAgent.QueryCatalog(id)
		if !ok {
			log.Print("viewAction, query catalog failed, illegal id or no exist")
			result.ErrorCode = common_result.NoExist
			result.Reason = "对象不存在"
			break
		}

		result.Content = catalog
		result.ErrorCode = common_result.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) deleteAction(res http.ResponseWriter, req *http.Request) {
	log.Print("deleteAction")

	type catalogResult struct {
		common_result.Result
	}

	result := catalogResult{}
	for {
		authToken := req.URL.Query().Get(common_def.AuthTokenID)
		sessionID := req.URL.Query().Get(common_def.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("deleteAction, delete catalog failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}

		_, value := net.SplitRESTAPI(req.URL.Path)
		id, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("deleteAction, strconv.Atoi failed, err:%s", err.Error())
			result.ErrorCode = common_result.IllegalParam
			result.Reason = "非法参数"
			break
		}

		ok := s.centerAgent.DeleteCatalog(id, authToken, sessionID)
		if !ok {
			log.Printf("deleteAction, delete catalog failed, id=%d", id)
			result.ErrorCode = common_result.Failed
			result.Reason = "删除对象失败"
			break
		}

		result.ErrorCode = common_result.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}
