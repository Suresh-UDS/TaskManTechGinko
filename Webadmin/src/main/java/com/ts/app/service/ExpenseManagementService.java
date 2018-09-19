package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.transaction.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.CategoryWiseExpense;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
import com.ts.app.domain.Site;
import com.ts.app.repository.ExpenseCategoryRepository;
import com.ts.app.repository.ExpenseRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExpenseDTO;

@Service
@Transactional
public class ExpenseManagementService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    @Inject
    private ExpenseRepository expenseRepository;

    @Inject
    private ExpenseCategoryRepository expenseCategoryRepository;

    @Inject
    private ExpenseDocumentRepository expenseDocumentRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

    @Inject
    private AmazonS3Utils s3ServiceUtils;


    public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {

        Expense expense = new Expense();

        Expense previousExpenseDetails = new Expense();

        ExpenseDTO expenseDTO1;

        if(expenseDTO.getSiteId()>0){
            Site site = siteRepository.findOne(expenseDTO.getSiteId());
            expense.setSite(site);

            previousExpenseDetails = findLatestRecordBySite(expenseDTO.getSiteId());
        }

        expense.setMode(expenseDTO.getMode());
        expense.setCurrency(expenseDTO.getCurrency());
        expense.setPaymentType(expenseDTO.getPaymentType());
        expense.setBillable(expenseDTO.isBillable());
        expense.setReimbursable(expenseDTO.isReimbursable());
        expense.setDescription(expenseDTO.getDescription());
//        expense.setBalanceAmount(expenseDTO.getBalanceAmount());

        if(Objects.equals(expenseDTO.getMode(), "debit")){
            expense.setExpenseCategory(expenseDTO.getExpenseCategory());
            expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount()-expenseDTO.getDebitAmount());
            expense.setDebitAmount(expenseDTO.getDebitAmount());
            expense.setExpenseDate(new Date());
        }


        if (Objects.equals(expenseDTO.getMode(), "credit")){
            if(previousExpenseDetails.getBalanceAmount()>0){
                expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount()+expenseDTO.getCreditAmount());
                expense.setCreditAmount(expenseDTO.getCreditAmount());

            }else{
                expense.setCreditAmount(expenseDTO.getCreditAmount());
            }

        }


        Expense saveResult = expenseRepository.save(expense);

         expenseDTO1 = mapperUtil.toModel(saveResult, ExpenseDTO.class);

         log.info("Expense saved - --------------"+expenseDTO1.getMode());

        return expenseDTO1 ;
    }

    public List<ExpenseDTO> findAll(int currPage) {
        Pageable pageRequest = createPageRequest(currPage);
        Page<Expense> result = expenseRepository.findAll(pageRequest);
        return mapperUtil.toModelList(result.getContent(), ExpenseDTO.class);
    }

    public SearchResult<ExpenseDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
        SearchResult<ExpenseDTO> result = new SearchResult<ExpenseDTO>();
        User user = userRepository.findOne(searchCriteria.getUserId());
        Employee employee = user.getEmployee();

        if (searchCriteria != null) {
                if (user.isAdmin()) {
                    searchCriteria.setAdmin(true);
                }
            Pageable pageRequest = null;

            if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                if (searchCriteria.isReport()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
                } else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
                }
            } else {
                if (searchCriteria.isList()) {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
                } else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }

            Page<Expense> page = null;
            List<Expense> allExpenseList = new ArrayList<Expense>();
            List<ExpenseDTO> transactions = null;

            if (!searchCriteria.isConsolidated()) {
                log.debug(">>> inside search consolidate <<<");
                page = expenseRepository.findAll(new ExpenseSpecification(searchCriteria, true), pageRequest);
                log.debug("Page size expense - "+page.getContent().size());
                allExpenseList.addAll(page.getContent());
            }

            if (CollectionUtils.isNotEmpty(allExpenseList)) {
                if (transactions == null) {
                    transactions = new ArrayList<ExpenseDTO>();
                }
                for (Expense expense : allExpenseList) {
                    transactions.add(mapperUtil.toModel(expense, ExpenseDTO.class));
                }
                buildSearchResult(searchCriteria, page, transactions, result);
            }
        }
        return result;


    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<Expense> page, List<ExpenseDTO> transactions, SearchResult<ExpenseDTO> result) {
        if (page != null) {
            result.setTotalPages(page.getTotalPages());
        }
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

        result.setTransactions(transactions);
        return;
    }


    public List<ExpenseCategory> findAllExpenseCategories(){
        return expenseCategoryRepository.findAll();
    }

    public Expense findLatestRecordBySite(long siteId) {
        List<Expense> expenseList = expenseRepository.findLatestEntryBySite(siteId);

        return expenseList.get(0);
    }
    public ExpenseDocumentDTO uploadFile(ExpenseDocumentDTO expenseDocumentDTO, MultipartFile file) {
        // TODO Auto-generated method stub
        Date uploadDate = new Date();
        Expense expense = expenseRepository.findOne(expenseDocumentDTO.getExpenseId());
        expenseDocumentDTO = s3ServiceUtils.uploadExpenseDocument(expense.getId(), file, expenseDocumentDTO);
        expenseDocumentDTO.setFile(expenseDocumentDTO.getFile());
        expenseDocumentDTO.setUploadedDate(uploadDate);
        expenseDocumentDTO.setTitle(expenseDocumentDTO.getTitle());
        ExpenseDocument expenseDocument = mapperUtil.toEntity(expenseDocumentDTO, ExpenseDocument.class);
        expenseDocument.setActive(AssetDocument.ACTIVE_YES);
        expenseDocument = expenseDocumentRepository.save(expenseDocument);
        expenseDocumentDTO.setUrl(expenseDocumentDTO.getUrl());
        return expenseDocumentDTO;
    }

	/**
	 * Returns the expenses grouped by expense categories for a site.
	 * @param siteId
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public List<CategoryWiseExpense> findExpenseByCategories(long siteId, Date fromDate, Date toDate) {
		if(fromDate != null) {
			toDate = (toDate == null ? fromDate : toDate);
			Timestamp fromTS = DateUtil.convertToTimestamp(fromDate);
			Timestamp toTS = DateUtil.convertToTimestamp(toDate);
			return expenseRepository.getCategoryWiseExpenseBySite(siteId, fromTS, toTS);
		}
		return expenseRepository.getCategoryWiseExpenseBySite(siteId);
	}

	/**
	 * Returns the expenses for a particular expense category for a site.
	 * @param siteId
	 * @param category
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public List<ExpenseDTO> findExpenseByCategory(long siteId, String category, Date fromDate, Date toDate) {
		List<ExpenseDTO> expenses = null;
		if(fromDate != null) {
			toDate = (toDate == null ? fromDate : toDate);
			Timestamp fromTS = DateUtil.convertToTimestamp(fromDate);
			Timestamp toTS = DateUtil.convertToTimestamp(toDate);
			List<Expense> expenseEntities = expenseRepository.getCategoryExpenseBySite(siteId, category, fromTS, toTS);
			if(CollectionUtils.isNotEmpty(expenseEntities)) {
				expenses = mapperUtil.toModelList(expenseEntities, ExpenseDTO.class);
			}
		}else {
			List<Expense> expenseEntities = expenseRepository.getCategoryExpenseBySite(siteId, category);
			if(CollectionUtils.isNotEmpty(expenseEntities)) {
				expenses = mapperUtil.toModelList(expenseEntities, ExpenseDTO.class);
			}
		}
		return expenses;
	}
}
