package core

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"muidea.com/magicCommon/agent"
	common_const "muidea.com/magicCommon/common"
	common_def "muidea.com/magicCommon/def"
	"muidea.com/magicCommon/foundation/net"
	"muidea.com/magicCommon/model"
	engine "muidea.com/magicEngine"
)

type route struct {
	pattern string
	method  string
	handler interface{}
}

func (s *route) Pattern() string {
	return s.pattern
}

func (s *route) Method() string {
	return s.method
}

func (s *route) Handler() interface{} {
	return s.handler
}

func newRoute(pattern, method string, handler interface{}) engine.Route {
	return &route{pattern: pattern, method: method, handler: handler}
}

// New 新建Share
func New(centerServer, name, endpointID, authToken string) (Share, bool) {
	share := Share{}

	agent := agent.New()
	authToken, sessionID, ok := agent.Start(centerServer, endpointID, authToken)
	if !ok {
		return share, false
	}
	shareCatalog, ok := agent.FetchSummary(name, model.CATALOG, authToken, sessionID)
	if !ok {
		log.Print("fetch share root ctalog failed.")
		return share, false
	}

	shareContent := agent.QuerySummaryContent(shareCatalog.ID, model.CATALOG, authToken, sessionID)
	shareView, ok := share.getShareView(shareContent)
	if !ok {
		log.Print("get ShareView failed.")
		return share, false
	}

	privacyView, ok := share.getPrivacyView(shareContent)
	if !ok {
		log.Print("get PrivacyView failed.")
		return share, false
	}

	share.shareView = shareView
	share.privacyView = privacyView

	share.centerAgent = agent
	share.shareInfo = shareCatalog
	share.endpointID = endpointID
	share.authToken = authToken
	share.sessionID = sessionID

	return share, true
}

// Share Share对象
type Share struct {
	centerAgent agent.Agent
	shareInfo   model.SummaryView
	endpointID  string
	authToken   string
	sessionID   string

	shareView   model.SummaryView
	privacyView model.SummaryView
}

// Startup 启动
func (s *Share) Startup(router engine.Router) {
	catalog := &model.Catalog{ID: s.privacyView.ID, Name: s.privacyView.Name}
	s.centerAgent.StrictCatalog(catalog)

	statusRoute := newRoute("/user/status/", "GET", s.statusAction)
	router.AddRoute(statusRoute)

	loginRoute := newRoute("/user/login/", "POST", s.loginAction)
	router.AddRoute(loginRoute)

	logoutRoute := newRoute("/user/logout/", "DELETE", s.logoutAction)
	router.AddRoute(logoutRoute)

	mainRoute := newRoute("/file/", "GET", s.mainPage)
	router.AddRoute(mainRoute)

	viewRoute := newRoute("/file/:id", "GET", s.viewPage)
	router.AddRoute(viewRoute)

	createRoute := newRoute("/file/", "POST", s.createAction)
	router.AddRoute(createRoute)

	deleteRoute := newRoute("/file/:id", "DELETE", s.deleteAction)
	router.AddRoute(deleteRoute)
}

// Teardown 销毁
func (s *Share) Teardown() {
	if s.centerAgent != nil {
		s.centerAgent.UnstrictCatalog()

		s.centerAgent.Stop()
	}
}

func (s *Share) getShareView(shareContent []model.SummaryView) (model.SummaryView, bool) {
	for _, v := range shareContent {
		if v.Name == "shareCatalog" && v.Type == model.CATALOG {
			return v, true
		}
	}

	return model.SummaryView{}, false
}

func (s *Share) getPrivacyView(shareContent []model.SummaryView) (model.SummaryView, bool) {
	for _, v := range shareContent {
		if v.Name == "privacyCatalog" && v.Type == model.CATALOG {
			return v, true
		}
	}

	return model.SummaryView{}, false
}

func (s *Share) mainPage(res http.ResponseWriter, req *http.Request) {
	log.Print("mainPage")

	type mainResult struct {
		common_def.QuerySummaryListResult
		PrivacyPolicy []model.Catalog `json:"privacyPolicy"`
	}

	result := mainResult{QuerySummaryListResult: common_def.QuerySummaryListResult{Summary: []model.SummaryView{}}}
	authToken := req.URL.Query().Get(common_const.AuthToken)
	sessionID := req.URL.Query().Get(common_const.SessionID)
	onlineEntry, _, _, isLogin := s.centerAgent.StatusAccount(authToken, sessionID)
	catalog := req.URL.Query().Get("catalog")
	for {
		cid := -1
		if len(catalog) > 0 {
			id, err := strconv.Atoi(catalog)
			if err != nil {
				result.ErrorCode = common_def.IllegalParam
				result.Reason = "无效参数"
				break
			}

			cid = id
		}

		shareList := []model.SummaryView{}
		privacyList := []model.SummaryView{}

		shareList = s.flatSummaryContent(s.shareView.ID, model.CATALOG, -1)
		if isLogin {
			privacyList = s.flatSummaryContent(s.privacyView.ID, model.CATALOG, onlineEntry.ID)
		}

		if cid >= 0 {
			for _, val := range shareList {
				if existCatalogArray(cid, val.Catalog) {
					if !existSummaryArray(val.ID, result.Summary) {
						result.Summary = append(result.Summary, val)
					}
				}
			}
			for _, val := range privacyList {
				if existCatalogArray(cid, val.Catalog) {
					if !existSummaryArray(val.ID, result.Summary) {
						result.Summary = append(result.Summary, val)
					}
				}
			}
		} else {
			for _, val := range shareList {
				if !existSummaryArray(val.ID, result.Summary) {
					result.Summary = append(result.Summary, val)
				}
			}

			for _, val := range privacyList {
				if !existSummaryArray(val.ID, result.Summary) {
					result.Summary = append(result.Summary, val)
				}
			}
		}

		result.PrivacyPolicy = append(result.PrivacyPolicy, model.Catalog{ID: s.shareView.ID, Name: s.shareView.Description})
		result.PrivacyPolicy = append(result.PrivacyPolicy, model.Catalog{ID: s.privacyView.ID, Name: s.privacyView.Description})

		result.ErrorCode = common_def.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	log.Print("mainPage, json.Marshal, failed, err:" + err.Error())
}

func (s *Share) viewPage(res http.ResponseWriter, req *http.Request) {
	log.Print("viewPage")

	type viewResult struct {
		common_def.QueryMediaResult
		AuthToken string `json:"authToken"`
		SessionID string `json:"sessionID"`
	}

	result := viewResult{}
	for {
		_, value := net.SplitRESTAPI(req.URL.Path)
		id, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("viewPage, query media failed, illegal id, id:%s, err:%s", value, err.Error())
			result.ErrorCode = common_def.Failed
			result.Reason = "非法参数"
			break
		}

		media, ok := s.centerAgent.QueryMedia(id, s.authToken, s.sessionID)
		if !ok {
			log.Print("viewPage, query media failed, illegal id or no exist")
			result.ErrorCode = common_def.NoExist
			result.Reason = "对象不存在"
			break
		}

		result.Media = media
		result.AuthToken = s.authToken
		result.SessionID = s.sessionID
		result.ErrorCode = common_def.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	log.Print("viewPage, json.Marshal, failed, err:" + err.Error())
}

func (s *Share) flatSummaryContent(id int, summaryType string, user int) []model.SummaryView {
	retList := []model.SummaryView{}
	summaryList := []model.SummaryView{}
	subList := []model.SummaryView{}

	if user == -1 {
		summaryList = s.centerAgent.QuerySummaryContent(id, summaryType, s.authToken, s.sessionID)
	} else {
		summaryList = s.centerAgent.QuerySummaryContentByUser(id, summaryType, s.authToken, s.sessionID, user)
	}
	for _, val := range summaryList {
		if val.Type == summaryType {
			if user == -1 {
				subList = s.centerAgent.QuerySummaryContent(val.ID, summaryType, s.authToken, s.sessionID)
			} else {
				subList = s.centerAgent.QuerySummaryContentByUser(val.ID, summaryType, s.authToken, s.sessionID, user)
			}

			for _, subVal := range subList {
				if !existSummaryArray(subVal.ID, retList) {
					retList = append(retList, subVal)
				}
			}

			continue
		}

		if !existSummaryArray(val.ID, retList) {
			retList = append(retList, val)
		}
	}

	return retList
}

func existCatalogArray(id int, catalogs []model.Catalog) bool {
	for _, val := range catalogs {
		if val.ID == id {
			return true
		}
	}

	return false
}

func existSummaryArray(id int, summarys []model.SummaryView) bool {
	for _, val := range summarys {
		if val.ID == id {
			return true
		}
	}

	return false
}
