import pandas as pd
import glob
import os
import sqlalchemy
import pymysql

# 디렉토리 경로 설정
air_pollution_dir = 'air_pollution_information'  # 대기오염 데이터 저장 경로
metal_data_dir = 'air_metal_reports'  # 중금속 데이터 저장 경로

# DB 연결 설정
engine = sqlalchemy.create_engine("mysql+pymysql://test:1234@127.0.0.1:3306/pythondb")

# 대기오염 데이터 불러오기
def load_air_pollution_data():
    air_files = glob.glob(os.path.join(air_pollution_dir, '*.xlsx'))
    air_data_frames = []
    for file in air_files:
        if os.path.basename(file).startswith('~$'):
            # 임시 파일은 무시
            continue
        df = pd.read_excel(file)
        # 파일 이름에서 날짜 추출
        datetime_str = os.path.basename(file).split('_')[0]
        df['timestamp'] = pd.to_datetime(datetime_str, format='%Y%m%d%H%M', errors='coerce')
        df.dropna(subset=['timestamp'], inplace=True)  # 빈 값 제거
        air_data_frames.append(df)
    return pd.concat(air_data_frames, ignore_index=True) if air_data_frames else pd.DataFrame()

# 중금속 데이터 불러오기
def load_metal_data():
    metal_files = glob.glob(os.path.join(metal_data_dir, '*.xlsx'))
    metal_data_frames = []
    for file in metal_files:
        if os.path.basename(file).startswith('~$'):
            # 임시 파일은 무시
            continue
        df = pd.read_excel(file)
        # 파일 이름에서 날짜 추출
        datetime_str = os.path.basename(file).split('_')[1]
        df['timestamp'] = pd.to_datetime(datetime_str, format='%Y%m%d%H%M', errors='coerce')
        df.dropna(subset=['category'], inplace=True)  # 빈 값 제거
        metal_data_frames.append(df)
    return pd.concat(metal_data_frames, ignore_index=True) if metal_data_frames else pd.DataFrame()

# 데이터 통합 및 평균 계산
def integrate_and_calculate_average():
    air_df = load_air_pollution_data()
    metal_df = load_metal_data()
    
    # 대기오염 데이터 날짜 및 지역별 평균 계산 및 저장
    if not air_df.empty:
        air_avg_folder = 'average_results/air_pollution'
        os.makedirs(air_avg_folder, exist_ok=True)
        
        # 날짜 및 지역별로 파일 그룹화하여 저장
        air_df['date'] = air_df['timestamp'].dt.date
        for (date, region), group in air_df.groupby(['date', 'region']):
            region_avg_results = group.mean(numeric_only=True)[['mask_8h_in', 'no_mask_8h_in', 'mask_8h_out', 'no_mask_8h_out', 'mask_12h_in', 'no_mask_12h_in', 'mask_12h_out', 'no_mask_12h_out']]
            region_avg_results = pd.DataFrame([region_avg_results])
            region_avg_results['region'] = region
            region_avg_results['date'] = date

            # 파일 저장
            air_avg_filename_xlsx = os.path.join(air_avg_folder, f'air_pollution_avg_{date.strftime("%Y%m%d")}_{region}.xlsx')
            air_avg_filename_csv = os.path.join(air_avg_folder, f'air_pollution_avg_{date.strftime("%Y%m%d")}_{region}.csv')
            region_avg_results.to_excel(air_avg_filename_xlsx, index=False)
            region_avg_results.to_csv(air_avg_filename_csv, index=False, encoding='utf-8-sig')
            print(f'대기오염 {date.strftime("%Y%m%d")} {region} 지역별 평균 데이터가 {air_avg_filename_xlsx} 및 {air_avg_filename_csv}에 저장되었습니다.')
            
            region_avg_results = region_avg_results[['region', 'mask_8h_in', 'no_mask_8h_in', 'mask_8h_out', 'no_mask_8h_out', 'mask_12h_in', 'no_mask_12h_in', 'mask_12h_out', 'no_mask_12h_out', 'date']]
            
            try:
                # 데이터베이스에 저장
                region_avg_results.to_sql('air_pollution_avg', con=engine, if_exists='append', index=False)
                print(f'대기오염 {date.strftime("%Y%m%d")} {region} 지역별 평균 데이터가 데이터베이스에 저장되었습니다.')
            except sqlalchemy.exc.IntegrityError as e:
                print(f'데이터베이스에 저장 중 중복 오류가 발생했습니다: {e}')
            except sqlalchemy.exc.OperationalError as e:
                print(f'데이터베이스에 저장 중 오류가 발생했습니다: {e}')
    
    # 중금속 데이터 날짜별 평균 계산 및 저장
    if not metal_df.empty:
        metal_avg_folder = 'average_results/metal'
        os.makedirs(metal_avg_folder, exist_ok=True)
        
        # 날짜별로 파일 그룹화하여 저장
        metal_df['date'] = metal_df['timestamp'].dt.date
        for date, group in metal_df.groupby('date'):
            category_avg_results = group.groupby('category').mean(numeric_only=True)[['measurement', 'risk_idx']]
            category_avg_results.reset_index(inplace=True)
            
            # 파일 저장
            metal_avg_filename_xlsx = os.path.join(metal_avg_folder, f'metal_avg_{date.strftime("%Y%m%d")}.xlsx')
            metal_avg_filename_csv = os.path.join(metal_avg_folder, f'metal_avg_{date.strftime("%Y%m%d")}.csv')
            category_avg_results.to_excel(metal_avg_filename_xlsx, index=False)
            category_avg_results.to_csv(metal_avg_filename_csv, index=False, encoding='utf-8-sig')
            print(f'중금속 {date.strftime("%Y%m%d")} 날짜별 평균 데이터가 {metal_avg_filename_xlsx} 및 {metal_avg_filename_csv}에 저장되었습니다.')
            
            category_avg_results['date'] = date
            category_avg_results = category_avg_results[['category', 'measurement', 'risk_idx', 'date']]
            
            try:
                # 데이터베이스에 저장
                category_avg_results.to_sql('metal_avg', con=engine, if_exists='append', index=False)
                print(f'중금속 {date.strftime("%Y%m%d")} 날짜별 평균 데이터가 데이터베이스에 저장되었습니다.')
            except sqlalchemy.exc.IntegrityError as e:
                print(f'데이터베이스에 저장 중 중복 오류가 발생했습니다: {e}')
            except sqlalchemy.exc.OperationalError as e:
                print(f'데이터베이스에 저장 중 오류가 발생했습니다: {e}')

# 통합 및 평균 계산 호출
integrate_and_calculate_average()
